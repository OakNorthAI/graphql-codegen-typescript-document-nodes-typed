import { PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers';
import { RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common';
export interface DocumentNodesTypedRawPluginConfig extends RawClientSideBasePluginConfig {
    documentNodeImportFrom?: string;
}
export declare const plugin: PluginFunction<DocumentNodesTypedRawPluginConfig>;
export declare const validate: PluginValidateFn<DocumentNodesTypedRawPluginConfig>;
