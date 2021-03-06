import { concatAST, visit, Kind } from 'graphql';
import { isString } from 'util';
import { DocumentNodesTypedVisitor } from './visitor';
function isFragmentDefinitionNode(node) {
    return node.kind === Kind.FRAGMENT_DEFINITION;
}
function loadFragment(node) {
    return { node, name: node.name.value, onType: node.typeCondition.name.value, isExternal: false };
}
export const plugin = (schema, documents, config) => {
    const allAst = concatAST(documents.map((source) => source.document));
    const allFragments = [...allAst.definitions.filter(isFragmentDefinitionNode).map(loadFragment), ...config.externalFragments];
    const visitor = new DocumentNodesTypedVisitor(schema, allFragments, config, documents);
    const visitorResult = visit(allAst, { leave: visitor });
    const imports = visitor.getImports();
    const fragments = visitor.fragments.split('\n');
    const definitions = visitorResult.definitions.filter(isString);
    return [...imports, ...fragments, ...definitions].join('\n');
};
export const validate = async (schema, documents, config, filename) => {
    if (config.noExport && filename.endsWith('.d.ts')) {
        throw new Error('Plugin "typescript-document-nodes-typed" with `noExport` cannot use extension ".d.ts"!');
    }
    if (!filename.endsWith('.ts') && !filename.endsWith('.tsx')) {
        throw new Error('Plugin "typescript-document-nodes-typed" requires extension to be ".ts" or ".tsx"!');
    }
};
//# sourceMappingURL=index.js.map