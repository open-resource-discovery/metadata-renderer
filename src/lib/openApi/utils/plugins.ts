import type { ApiReferencePlugin } from '@scalar/types/api-reference';
import { createElement, type JSX } from 'react';
import type { OpenApiCustomAttributesConfig } from '../customAttributes/types';
import { discoverAttributeNames, SCHEMA_ATTRS_KEY } from '../customAttributes/autoDiscover';
import { buildGenericRenderer } from '../customAttributes/genericRenderer';
import { ReactRenderer } from '@scalar/react-renderer';

function camelCaseKeys(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
        const camelKey = k.replace(/-./g, (x) => x[1].toUpperCase());
        result[camelKey] = v;
    }
    return result;
}

function buildSchemaAttrsRenderer(configs: OpenApiCustomAttributesConfig[]): (data: unknown) => JSX.Element | null {
    return (data: unknown): JSX.Element | null => {
        if (!data || typeof data !== 'object') return null;
        const outer = data as Record<string, unknown>;
        // ReactRenderer camelCases Vue attrs, so 'x-sap-schema-attrs' → 'xSapSchemaAttrs'
        const xFields = (outer['xSapSchemaAttrs'] ?? outer[SCHEMA_ATTRS_KEY]) as Record<string, unknown> | undefined;
        if (!xFields || typeof xFields !== 'object') return null;

        // buildGenericRenderer's extractValue looks up camelCase keys, so we camelCase xFields
        const camelData = camelCaseKeys(xFields);

        const renderers: JSX.Element[] = [];
        for (const key of Object.keys(xFields)) {
            if (!key.startsWith('x-')) continue;
            const matchingConfig =
                configs.find((c) => c.extensions?.[key]) ??
                configs.find((c) => c.prefixStartsWith && key.startsWith(c.prefixStartsWith));
            if (!matchingConfig) continue;
            const def = matchingConfig.extensions?.[key];
            const renderer = buildGenericRenderer(key, def, matchingConfig);
            const el = renderer(camelData);
            if (el) renderers.push(el);
        }

        if (renderers.length === 0) return null;
        return createElement('div', { className: 'sap-schema-attrs-block' }, ...renderers);
    };
}

export function buildCustomAttributesPlugin(
    doc: Record<string, unknown> | undefined,
    configs: OpenApiCustomAttributesConfig[],
): ApiReferencePlugin {
    const allNames = new Set<string>();

    for (const config of configs) {
        if (config.extensions) {
            for (const name of Object.keys(config.extensions)) {
                allNames.add(name);
            }
        }
        if (config.prefixStartsWith && doc) {
            for (const name of discoverAttributeNames(doc, config.prefixStartsWith)) {
                allNames.add(name);
            }
        }
    }

    const extensions = [...allNames].map((name) => {
        const matchingConfig =
            configs.find((c) => c.extensions?.[name]) ??
            configs.find((c) => c.prefixStartsWith && name.startsWith(c.prefixStartsWith)) ??
            configs[0];

        const def = matchingConfig?.extensions?.[name];
        const renderer = buildGenericRenderer(name, def, matchingConfig ?? {});

        return {
            name,
            component: renderer,
            renderer: ReactRenderer,
        };
    });

    // Add the synthetic schema-level extension renderer
    extensions.push({
        name: SCHEMA_ATTRS_KEY,
        component: buildSchemaAttrsRenderer(configs),
        renderer: ReactRenderer,
    });

    return () => ({
        name: 'custom-attributes-plugin',
        extensions,
    });
}
