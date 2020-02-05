import { ClientSideBaseVisitor, DocumentMode, getConfigValue } from '@graphql-codegen/visitor-plugin-common';
import { pascalCase } from 'pascal-case';
function nonNull(t) {
    return t != null;
}
export class DocumentNodesTypedVisitor extends ClientSideBaseVisitor {
    constructor(schema, fragments, rawConfig, documents) {
        const additionalConfig = {
            documentNodeImportFrom: getConfigValue(rawConfig.documentNodeImportFrom, 'graphql-typed'),
        };
        super(schema, fragments, rawConfig, additionalConfig, documents);
    }
    getImports() {
        const { documentMode, importDocumentNodeExternallyFrom, documentNodeImportFrom } = this.config;
        const imports = [];
        imports.push(`import { DocumentNode } from '${documentNodeImportFrom}';`);
        if (documentMode === DocumentMode.graphQLTag) {
            imports.push(...super.getImports());
        }
        if (documentMode === DocumentMode.external && importDocumentNodeExternallyFrom !== 'near-operation-file') {
            imports.push(`import * as Operations from '${importDocumentNodeExternallyFrom}';`);
        }
        return imports;
    }
    OperationDefinition(node) {
        if (node.name == null || node.name.value == null)
            return null;
        this._collectedOperations.push(node);
        const operationType = pascalCase(node.operation);
        const operationTypeSuffix = this.config.dedupeOperationSuffix && node.name.value.toLowerCase().endsWith(node.operation) ? '' : operationType;
        const { operationResultSuffix, documentVariablePrefix, documentVariableSuffix } = this.config;
        const operationVariablesSuffix = 'Variables';
        const documentVariableName = this.convertName(node, {
            prefix: documentVariablePrefix,
            suffix: documentVariableSuffix,
            useTypesPrefix: false,
        });
        const operationResultType = this.convertName(node, {
            suffix: operationTypeSuffix + operationResultSuffix,
        });
        const operationVariableTypes = this.convertName(node, {
            suffix: operationTypeSuffix + operationVariablesSuffix,
        });
        const documentVariableType = `DocumentNode<${operationResultType}, ${operationVariableTypes}>`;
        const { documentMode, noExport, importDocumentNodeExternallyFrom } = this.config;
        const isExternal = documentMode === DocumentMode.external;
        const modifier = noExport ? '' : 'export';
        const value = isExternal ? (importDocumentNodeExternallyFrom === 'near-operation-file' ? null : `Operations.${documentVariableName}`) : this._gql(node);
        const documentNode = `${modifier} const ${documentVariableName}: ${documentVariableType}${value ? ` = ${value}` : ''};`;
        const additional = this.buildOperation(node, documentVariableName, operationType, operationResultType, operationVariableTypes);
        return [documentNode, additional].filter(nonNull).join('\n\n');
    }
}
//# sourceMappingURL=visitor.js.map