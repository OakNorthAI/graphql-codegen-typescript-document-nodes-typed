import { PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers';
import { RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common';
export interface TypedDocumentNodesRawPluginConfig extends RawClientSideBasePluginConfig {
    documentNodeImportFrom?: string;
}
export declare const plugin: PluginFunction<TypedDocumentNodesRawPluginConfig>;
export declare const validate: PluginValidateFn<TypedDocumentNodesRawPluginConfig>;
