import { useEffect, useId, useMemo, useRef } from 'react';
import { createApiReference } from '@scalar/api-reference';
import { type AnyApiReferenceConfiguration } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';
import { openApiContext, getVersion } from './utils/context';
import { buildCustomAttributesPlugin } from './utils/plugins';
import { buildScalarThemeStyles } from './utils/scalarTheme';
import { findScrollParent, sidebarHeight } from './utils/sidebarHeight';
import { extractCustomAttributeValues, injectSchemaExtensions } from './customAttributes/autoDiscover';

import sapAttributeStyles from './styles';
import type { RendererTheme } from '../types';
import type { OpenApiCustomAttributesConfig } from './customAttributes/types';
import { loadObject } from '../core/utils';

// Scalar is a Vue app; @scalar/api-reference-react's wrapper sets these Vue feature
// flags as a side effect of importing its `vue-bundler-flags` module. We mount Scalar
// directly (via createApiReference) instead of through that wrapper, so set the flags
// here too — otherwise Vue logs a "feature flags not explicitly defined" dev warning.
const vueFlags = globalThis as unknown as Record<string, boolean>;
vueFlags.__VUE_OPTIONS_API__ = true;
vueFlags.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = true;
vueFlags.__VUE_PROD_DEVTOOLS__ = false;

export type OpenApiRendererProps = {
    content: string;
    customAttributes?: OpenApiCustomAttributesConfig[];
    className?: string;
    theme?: RendererTheme;
};

export function OpenApiRenderer({ content, customAttributes, className, theme }: OpenApiRendererProps) {
    const id = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const scalarRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<ReturnType<typeof createApiReference> | null>(null);
    const isDark = className?.split(/\s+/).includes('dark') ?? false;

    const activeConfigs = useMemo<OpenApiCustomAttributesConfig[]>(() => customAttributes ?? [], [customAttributes]);
    const isEnabled = customAttributes !== undefined;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        // Drives Scalar's sticky sidebar height (see styles.ts), capped at what is visible of the
        // container so an auto-height host can't make the layout grow without bound (sidebarHeight.ts).
        const scrollPort = findScrollParent(el);
        const update = () => {
            const height = sidebarHeight(el.clientHeight, scrollPort?.clientHeight ?? null, window.innerHeight);
            el.style.setProperty('--scalar-container-height', `${height}px`);
        };
        const ro = new ResizeObserver(update);
        ro.observe(el);
        if (scrollPort) ro.observe(scrollPort);
        window.addEventListener('resize', update);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', update);
            if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            // Scalar's useColorMode adds a light-mode/dark-mode class to document.body and
            // never removes it on unmount, leaking `color-scheme` onto the host page (white
            // background). Strip it so the page follows its own theme again.
            document.body.classList.remove('light-mode', 'dark-mode');
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

    // Mount Scalar directly rather than through @scalar/api-reference-react, whose effect
    // cleanup returns `instance.destroy` and so runs synchronously during React's commit.
    // That synchronous teardown chains into Vue's app.unmount() → @scalar/react-renderer's
    // nested react-dom root.unmount(), which React 19 warns about ("Attempted to
    // synchronously unmount a root while React was already rendering"). Remount on the same
    // identity the old `key` encoded (isDark / isEnabled / customAttributesKey).
    //
    // Each mount gets its OWN fresh child element inside the stable host: createApiReference
    // calls app.mount() on the element we pass and destroy() → app.unmount() clears it. If
    // instances shared one element, the deferred destroy of the outgoing instance would wipe
    // the DOM of the incoming one (and a non-empty element makes Scalar mount in SSR/hydration
    // mode — html-api.js). A per-mount child keeps outgoing teardown from touching the new app.
    useEffect(() => {
        const host = scalarRef.current;
        if (!host) return;
        const mountPoint = document.createElement('div');
        mountPoint.style.height = '100%';
        host.appendChild(mountPoint);
        const instance = createApiReference(mountPoint, { _integration: 'react', ...configuration });
        instanceRef.current = instance;
        return () => {
            instanceRef.current = null;
            // Defer teardown out of React's commit phase so the nested react-dom
            // root.unmount() runs after the host finishes committing, not during it.
            queueMicrotask(() => {
                instance.destroy();
                mountPoint.remove();
            });
        };
    }, [isDark, isEnabled, customAttributesKey]);

    // Apply config changes reactively (what ApiReferenceReact's second effect did).
    useEffect(() => {
        instanceRef.current?.updateConfiguration({ _integration: 'react', ...configuration });
    }, [configuration]);

    return (
        <div ref={containerRef} data-renderer-id={id} style={{ height: '100%', ...theme }}>
            <style>{sapAttributeStyles}</style>
            {theme && <style>{buildScalarThemeStyles(id, theme as Record<string, string>)}</style>}
            <div ref={scalarRef} />
        </div>
    );
}
