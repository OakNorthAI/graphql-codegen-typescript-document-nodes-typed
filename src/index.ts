import { PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers';
import { LoadedFragment, RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common';
import { concatAST, visit } from 'graphql';

import { TypedDocumentNodesVisitor } from './visitor';

function isString(t: any): t is string {
  return typeof t === 'string'
}

export interface TypedDocumentNodesRawPluginConfig extends RawClientSideBasePluginConfig {
  documentNodeImportFrom?: string;
}

export const plugin: PluginFunction<TypedDocumentNodesRawPluginConfig> = (schema, documents, config) => {
  const ast = concatAST(documents.reduce((prev, v) => [...prev, v.content], []));
  const fragments: LoadedFragment[] = [];

  const visitor = new TypedDocumentNodesVisitor(fragments, config, documents);

  const visitorImports = visitor.getImports();
  const visitorResult = visit(ast, { leave: visitor });

  return visitorImports
    .concat(visitorResult.definitions)
    .filter(isString)
    .join('\n\n')
    .concat('\n\n');
};

export const validate: PluginValidateFn<TypedDocumentNodesRawPluginConfig> = async (schema, documents, config, filename) => {
  if (config.noExport && filename.endsWith('.d.ts')) {
    throw new Error('Plugin "typescript-document-nodes-typed" with `noExport` cannot use extension ".d.ts"!');
  }
  if (!filename.endsWith('.ts') && filename.endsWith('.tsx')) {
    throw new Error('Plugin "typescript-document-nodes-typed" requires extension to be ".ts" or ".tsx"!');
  }
};
