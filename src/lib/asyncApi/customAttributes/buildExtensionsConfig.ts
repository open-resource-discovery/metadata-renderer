import { createElement, type ComponentType } from 'react';
import {
    PluginSlot,
    type ExtensionComponentProps,
    type AsyncApiPlugin,
    type PluginContext,
} from '@asyncapi/react-component';
import type { AsyncApiCustomAttributesConfig } from './types';
import { asyncApiContext } from './context';
import { buildAsyncApiGenericRenderer } from './genericRenderer';
import { discoverAsyncApiFieldNames, extractRootFields } from './autoDiscover';

type SlotProps = { context: PluginContext; onClose?: () => void };

export function buildAsyncApiExtensionsConfig(
    configs: AsyncApiCustomAttributesConfig[],
    doc: Record<string, unknown> | null,
    version: string,
): Record<string, ComponentType<ExtensionComponentProps>> {
    asyncApiContext.version = version;
    asyncApiContext.configs = configs;

    if (doc) {
        const prefixes = configs.map((c) => c.prefixStartsWith).filter(Boolean) as string[];
        asyncApiContext.rootFields = prefixes.length ? extractRootFields(doc, prefixes) : {};
    } else {
        asyncApiContext.rootFields = {};
    }

    const result: Record<string, ComponentType<ExtensionComponentProps>> = {};

    for (const config of configs) {
        for (const [key, def] of Object.entries(config.extensions ?? {})) {
            result[key] = buildAsyncApiGenericRenderer(key, def, config);
        }
        if (config.prefixStartsWith && doc) {
            for (const key of discoverAsyncApiFieldNames(doc, config.prefixStartsWith)) {
                if (!result[key]) {
                    result[key] = buildAsyncApiGenericRenderer(key, undefined, config);
                }
            }
        }
    }

    return result;
}

export function buildRootExtensionsPlugin(configs: AsyncApiCustomAttributesConfig[]): AsyncApiPlugin {
    function rootExtensionsSlot(_props: SlotProps) {
        const entries = Object.entries(asyncApiContext.rootFields);
        if (!entries.length) return null;

        const nodes = entries.flatMap(([key, value]) => {
            const config =
                asyncApiContext.configs.find((c) => c.extensions?.[key]) ??
                asyncApiContext.configs.find((c) => c.prefixStartsWith && key.startsWith(c.prefixStartsWith)) ??
                configs[0];
            if (!config) return [];
            const def = config.extensions?.[key];
            const fieldComponent = buildAsyncApiGenericRenderer(key, def, config);
            return [
                createElement(fieldComponent, {
                    key,
                    propertyName: key,
                    propertyValue: value,
                    // document and parent are not used by our renderers
                    document: undefined as never,
                    parent: undefined as never,
                }),
            ];
        });

        return nodes.length ? createElement('div', null, ...nodes) : null;
    }

    return {
        name: 'sap-root-extensions',
        version: '1.0.0',
        install(api) {
            api.registerComponent(PluginSlot.INFO, rootExtensionsSlot);
        },
    };
}
