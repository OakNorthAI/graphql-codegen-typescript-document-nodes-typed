import { concatAST, visit } from 'graphql';
import { TypedDocumentNodesVisitor } from './visitor';
function isString(t) {
    return typeof t === 'string';
}
export const plugin = (schema, documents, config) => {
    const ast = concatAST(documents.reduce((prev, v) => [...prev, v.content], []));
    const fragments = [];
    const visitor = new TypedDocumentNodesVisitor(fragments, config, documents);
    const visitorImports = visitor.getImports();
    const visitorResult = visit(ast, { leave: visitor });
    return visitorImports
        .concat(visitorResult.definitions)
        .filter(isString)
        .join('\n\n')
        .concat('\n\n');
};
export const validate = async (schema, documents, config, filename) => {
    if (config.noExport && filename.endsWith('.d.ts')) {
        throw new Error('Plugin "typescript-document-nodes-typed" with `noExport` cannot use extension ".d.ts"!');
    }
    if (!filename.endsWith('.ts') && filename.endsWith('.tsx')) {
        throw new Error('Plugin "typescript-document-nodes-typed" requires extension to be ".ts" or ".tsx"!');
    }
};
//# sourceMappingURL=index.js.map