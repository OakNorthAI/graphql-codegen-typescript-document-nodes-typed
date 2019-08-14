"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
function nonNull(t) {
    return t != null;
}
class TypedDocumentNodesVisitor extends visitor_plugin_common_1.ClientSideBaseVisitor {
    constructor(fragments, rawConfig, documents) {
        const additionalConfig = {
            documentNodeImportFrom: visitor_plugin_common_1.getConfigValue(rawConfig.documentNodeImportFrom, 'graphql-typed'),
        };
        super(fragments, rawConfig, additionalConfig, documents);
    }
    getImports() {
        const { documentMode, importDocumentNodeExternallyFrom, documentNodeImportFrom } = this.config;
        const imports = [];
        imports.push(`import { DocumentNode } from '${documentNodeImportFrom}';`);
        if (documentMode === visitor_plugin_common_1.DocumentMode.graphQLTag) {
            imports.push(...super.getImports());
        }
        if (documentMode === visitor_plugin_common_1.DocumentMode.external && importDocumentNodeExternallyFrom !== 'near-operation-file') {
            imports.push(`import * as Operations from '${importDocumentNodeExternallyFrom}';`);
        }
        return imports;
    }
    OperationDefinition(node) {
        if (node.name == null || node.name.value == null)
            return null;
        this._collectedOperations.push(node);
        const operationType = plugin_helpers_1.toPascalCase(node.operation);
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
        const isExternal = documentMode === visitor_plugin_common_1.DocumentMode.external;
        const modifier = noExport ? '' : 'export';
        const value = isExternal ? (importDocumentNodeExternallyFrom === 'near-operation-file' ? null : `Operations.${documentVariableName};`) : this._gql(node);
        const documentNode = `${modifier} const ${documentVariableName}: ${documentVariableType}${value ? ` = ${value}` : ''};`;
        const additional = this.buildOperation(node, documentVariableName, operationType, operationResultType, operationVariableTypes);
        return [documentNode, additional].filter(nonNull).join('\n\n');
    }
}
exports.TypedDocumentNodesVisitor = TypedDocumentNodesVisitor;
//# sourceMappingURL=visitor.js.map