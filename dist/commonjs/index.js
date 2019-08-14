"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const visitor_1 = require("./visitor");
function isString(t) {
    return typeof t === 'string';
}
exports.plugin = (schema, documents, config) => {
    const ast = graphql_1.concatAST(documents.reduce((prev, v) => [...prev, v.content], []));
    const fragments = [];
    const visitor = new visitor_1.TypedDocumentNodesVisitor(fragments, config, documents);
    const visitorImports = visitor.getImports();
    const visitorResult = graphql_1.visit(ast, { leave: visitor });
    return visitorImports
        .concat(visitorResult.definitions)
        .filter(isString)
        .join('\n\n')
        .concat('\n\n');
};
exports.validate = async (schema, documents, config, filename) => {
    if (config.noExport && filename.endsWith('.d.ts')) {
        throw new Error('Plugin "typescript-document-nodes-typed" with `noExport` cannot use extension ".d.ts"!');
    }
    if (!filename.endsWith('.ts') && filename.endsWith('.tsx')) {
        throw new Error('Plugin "typescript-document-nodes-typed" requires extension to be ".ts" or ".tsx"!');
    }
};
//# sourceMappingURL=index.js.map