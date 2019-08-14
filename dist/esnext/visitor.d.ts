import { Types } from '@graphql-codegen/plugin-helpers';
import { ClientSideBasePluginConfig, ClientSideBaseVisitor, LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { OperationDefinitionNode } from 'graphql';
import { TypedDocumentNodesRawPluginConfig } from './index';
export interface TypedDocumentNodesPluginConfig extends ClientSideBasePluginConfig {
    documentNodeImportFrom: string;
}
export declare class TypedDocumentNodesVisitor extends ClientSideBaseVisitor<TypedDocumentNodesRawPluginConfig, TypedDocumentNodesPluginConfig> {
    constructor(fragments: LoadedFragment[], rawConfig: TypedDocumentNodesRawPluginConfig, documents: Types.DocumentFile[]);
    getImports(): string[];
    OperationDefinition(node: OperationDefinitionNode): string | null;
}
