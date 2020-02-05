"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const util_1 = require("util");
const visitor_1 = require("./visitor");
function isFragmentDefinitionNode(node) {
    return node.kind === graphql_1.Kind.FRAGMENT_DEFINITION;
}
function loadFragment(node) {
    return { node, name: node.name.value, onType: node.typeCondition.name.value, isExternal: false };
}
exports.plugin = (schema, documents, config) => {
    const allAst = graphql_1.concatAST(documents.map((source) => source.document));
    const allFragments = [...allAst.definitions.filter(isFragmentDefinitionNode).map(loadFragment), ...config.externalFragments];
    const visitor = new visitor_1.DocumentNodesTypedVisitor(schema, allFragments, config, documents);
    const visitorResult = graphql_1.visit(allAst, { leave: visitor });
    const imports = visitor.getImports();
    const fragments = visitor.fragments.split('\n');
    const definitions = visitorResult.definitions.filter(util_1.isString);
    return [...imports, ...fragments, ...definitions].join('\n');
};
exports.validate = async (schema, documents, config, filename) => {
    if (config.noExport && filename.endsWith('.d.ts')) {
        throw new Error('Plugin "typescript-document-nodes-typed" with `noExport` cannot use extension ".d.ts"!');
    }
    if (!filename.endsWith('.ts') && !filename.endsWith('.tsx')) {
        throw new Error('Plugin "typescript-document-nodes-typed" requires extension to be ".ts" or ".tsx"!');
    }
};
//# sourceMappingURL=index.js.map