import { useEffect, useId, useMemo, useRef } from 'react';
import { ApiReferenceReact, type AnyApiReferenceConfiguration } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';
import { openApiContext, getVersion } from './utils/context';
import { buildCustomAttributesPlugin } from './utils/plugins';
import { buildScalarThemeStyles } from './utils/scalarTheme';
import { extractCustomAttributeValues, injectSchemaExtensions } from './customAttributes/autoDiscover';

import sapAttributeStyles from './styles';
import type { RendererTheme } from '../types';
import type { OpenApiCustomAttributesConfig } from './customAttributes/types';
import { loadObject } from '../core/utils';

export type OpenApiRendererProps = {
    content: string;
    customAttributes?: OpenApiCustomAttributesConfig[];
    className?: string;
    theme?: RendererTheme;
};

export function OpenApiRenderer({ content, customAttributes, className, theme }: OpenApiRendererProps) {
    const id = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const isDark = className?.split(/\s+/).includes('dark') ?? false;

    const activeConfigs = useMemo<OpenApiCustomAttributesConfig[]>(() => customAttributes ?? [], [customAttributes]);
    const isEnabled = customAttributes !== undefined;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            el.style.setProperty('--scalar-container-height', `${entry.contentRect.height}px`);
        });
        ro.observe(el);
        return () => {
            ro.disconnect();
            if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        };
    }, []);

    // Fingerprint only the custom attribute values so Scalar remounts when they
    // change, but not on every other content edit (Scalar handles those reactively).
    const customAttributesKey = useMemo(() => {
        if (!isEnabled) return '';
        const parsed = loadObject(content) as Record<string, unknown> | undefined;
        if (!parsed) return '';
        return activeConfigs
            .flatMap((config) =>
                extractCustomAttributeValues(parsed, config.prefixStartsWith ?? '').map(
                    ([k, v]) => `${k}=${JSON.stringify(v)}`,
                ),
            )
            .join('|');
    }, [content, isEnabled, activeConfigs]);

    const configuration = useMemo<AnyApiReferenceConfiguration>(() => {
        openApiContext.version = getVersion(content);
        openApiContext.configs = isEnabled ? activeConfigs : [];
        const parsed = loadObject(content) as Record<string, unknown> | undefined;
        const prefixes = activeConfigs.map((c) => c.prefixStartsWith).filter(Boolean) as string[];
        const docForScalar =
            isEnabled && parsed && prefixes.length ? injectSchemaExtensions(parsed, prefixes) : (parsed ?? content);
        return {
            content: docForScalar,
            plugins: isEnabled ? [buildCustomAttributesPlugin(parsed, activeConfigs)] : [],
            forceDarkModeState: isDark ? 'dark' : 'light',
            hideDarkModeToggle: true,
            hideClientButton: true,
            showDeveloperTools: 'never',
        };
    }, [content, isDark, isEnabled, activeConfigs]);

    return (
        <div ref={containerRef} data-renderer-id={id} style={{ height: '100%', ...theme }}>
            <style>{sapAttributeStyles}</style>
            {theme && <style>{buildScalarThemeStyles(id, theme as Record<string, string>)}</style>}
            <ApiReferenceReact
                key={`${isDark ? 'dark' : 'light'}-${isEnabled}-${customAttributesKey}`}
                configuration={configuration}
            />
        </div>
    );
}
