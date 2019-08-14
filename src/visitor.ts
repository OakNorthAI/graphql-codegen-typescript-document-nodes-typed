import { toPascalCase, Types } from '@graphql-codegen/plugin-helpers';
import { ClientSideBasePluginConfig, ClientSideBaseVisitor, DocumentMode, getConfigValue, LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { OperationDefinitionNode } from 'graphql';

import { TypedDocumentNodesRawPluginConfig } from './index';

function nonNull<T>(t: T | null): t is T {
  return t != null;
}

export interface TypedDocumentNodesPluginConfig extends ClientSideBasePluginConfig {
  documentNodeImportFrom: string;
}

export class TypedDocumentNodesVisitor extends ClientSideBaseVisitor<TypedDocumentNodesRawPluginConfig, TypedDocumentNodesPluginConfig> {
  constructor(fragments: LoadedFragment[], rawConfig: TypedDocumentNodesRawPluginConfig, documents: Types.DocumentFile[]) {
    const additionalConfig: Partial<TypedDocumentNodesPluginConfig> = {
      documentNodeImportFrom: getConfigValue(rawConfig.documentNodeImportFrom, 'graphql-typed'),
    };

    super(fragments, rawConfig, additionalConfig, documents);
  }

  public getImports(): string[] {
    const { documentMode, importDocumentNodeExternallyFrom, documentNodeImportFrom } = this.config;
    const imports: string[] = [];

    imports.push(`import { DocumentNode } from '${documentNodeImportFrom}';`);

    if (documentMode === DocumentMode.graphQLTag) {
      imports.push(...super.getImports());
    }

    if (documentMode === DocumentMode.external && importDocumentNodeExternallyFrom !== 'near-operation-file') {
      imports.push(`import * as Operations from '${importDocumentNodeExternallyFrom}';`);
    }

    return imports;
  }

  public OperationDefinition(node: OperationDefinitionNode): string | null {
    if (node.name == null || node.name.value == null) return null;

    this._collectedOperations.push(node);

    const operationType = toPascalCase(node.operation);
    const operationTypeSuffix = this.config.dedupeOperationSuffix && node.name.value.toLowerCase().endsWith(node.operation) ? '' : operationType;

    const { transformUnderscore, operationResultSuffix, documentVariablePrefix, documentVariableSuffix } = this.config;
    const operationVariablesSuffix = 'Variables';

    const documentVariableName = this.convertName(node, {
      prefix: documentVariablePrefix,
      suffix: documentVariableSuffix,
      transformUnderscore,
      useTypesPrefix: false,
    });

    const operationResultType = this.convertName(node, {
      suffix: operationTypeSuffix + operationResultSuffix,
      transformUnderscore,
    });

    const operationVariableTypes = this.convertName(node, {
      suffix: operationTypeSuffix + operationVariablesSuffix,
      transformUnderscore,
    });

    const documentVariableType = `DocumentNode<${operationResultType}, ${operationVariableTypes}>`;

    const { documentMode, noExport, importDocumentNodeExternallyFrom } = this.config;

    const isExternal = documentMode === DocumentMode.external;
    const modifier = noExport ? '' : 'export';
    const value = isExternal ? (importDocumentNodeExternallyFrom === 'near-operation-file' ? null : `Operations.${documentVariableName};`) : this._gql(node);

    const documentNode = `${modifier} const ${documentVariableName}: ${documentVariableType}${value ? ` = ${value}` : ''};`;
    const additional = this.buildOperation(node, documentVariableName, operationType, operationResultType, operationVariableTypes);

    return [documentNode, additional].filter(nonNull).join('\n\n');
  }
}
