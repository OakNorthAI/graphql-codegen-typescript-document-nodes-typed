import { Types } from '@graphql-codegen/plugin-helpers';
import { ClientSideBasePluginConfig, ClientSideBaseVisitor, LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { OperationDefinitionNode, GraphQLSchema } from 'graphql';
import { DocumentNodesTypedRawPluginConfig } from './index';
export interface TypedDocumentNodesPluginConfig extends ClientSideBasePluginConfig {
    documentNodeImportFrom: string;
}
export declare class DocumentNodesTypedVisitor extends ClientSideBaseVisitor<DocumentNodesTypedRawPluginConfig, TypedDocumentNodesPluginConfig> {
    constructor(schema: GraphQLSchema, fragments: LoadedFragment[], rawConfig: DocumentNodesTypedRawPluginConfig, documents: Types.DocumentFile[]);
    getImports(): string[];
    OperationDefinition(node: OperationDefinitionNode): string | null;
}
