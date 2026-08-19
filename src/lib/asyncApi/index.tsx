import { useMemo, useId } from 'react';
import AsyncApiComponent from '@asyncapi/react-component/browser/index.js';
import type { ConfigInterface } from '@asyncapi/react-component';
import '@asyncapi/react-component/styles/default.css';
import type { RendererTheme } from '../types';
import type { AsyncApiCustomAttributesConfig } from './customAttributes/types';
import { buildAsyncApiExtensionsConfig, buildRootExtensionsPlugin } from './customAttributes/buildExtensionsConfig';
import customAttributeStyles from './customAttributes/styles';
import { loadObject } from '../core/utils';

export type AsyncApiRendererProps = {
    content: string;
    config?: Partial<ConfigInterface>;
    customAttributes?: AsyncApiCustomAttributesConfig[];
    className?: string;
    theme?: RendererTheme;
};

const DARK_DEFAULTS: RendererTheme = {
    '--ord-background': '#1e1e1e',
    '--ord-foreground': '#d4d4d4',
    '--ord-card': '#252526',
    '--ord-primary': '#0098ff',
    '--ord-primary-foreground': '#1e1e1e',
    '--ord-muted': '#2d2d30',
    '--ord-muted-foreground': '#969696',
    '--ord-border': '#3e3e42',
};

function buildAsyncApiThemeStyle(id: string, theme: RendererTheme): string {
    const t = theme as Record<string, string>;
    const bg = t['--ord-background'];
    const fg = t['--ord-foreground'];
    const secondary = t['--ord-secondary'];
    const secondaryFg = t['--ord-secondary-foreground'];
    const muted = t['--ord-muted'];
    const mutedFg = t['--ord-muted-foreground'];
    const border = t['--ord-border'];
    const primary = t['--ord-primary'];
    const primaryFg = t['--ord-primary-foreground'];
    const accent = t['--ord-accent'];
    const accentFg = t['--ord-accent-foreground'];
    const borderRadius = t['--ord-radius'];

    const rules: string[] = [];
    const scope = `[data-renderer-id="${id}"]`;

    if (bg) rules.push(`${scope} .bg-white { background-color: ${bg} !important; }`);
    if (fg) rules.push(`${scope} {color: ${fg}; }`);
    if (accent && accentFg) rules.push(`${scope} .bg-blue-100 { color: ${accentFg}; background-color: ${accent}; }`);
    if (secondary) rules.push(`${scope} .bg-gray-100 { background-color: ${secondary} !important; }`);
    if (secondaryFg) rules.push(`${scope} .prose, ${scope} .text-gray-700 { color: ${secondaryFg}; }`);
    if (muted) rules.push(`${scope} .bg-gray-200 { background-color: ${muted} !important; }`);
    if (mutedFg) rules.push(`${scope} .text-gray-500, ${scope} .text-gray-600 { color: ${mutedFg} !important; }`);
    //Example section
    if (primary)
        rules.push(
            `${scope} .bg-gray-800 { background-color: ${primary} !important; }`,
            `${scope} .bg-blue-100 .text-purple-700 { color: ${primary}; }`,
        );
    if (primaryFg) rules.push(`${scope} .text-white { color: ${primaryFg} !important; }`);
    if (secondary) rules.push(`${scope} .bg-gray-400 { background-color: ${secondary} !important; }`);
    if (accentFg)
        rules.push(`${scope} .text-gray-200, ${scope} .examples .text-gray-600 { color: ${accentFg} !important; } `);

    if (fg) rules.push(`${scope} .text-gray-800, ${scope} .text-gray-900 { color: ${fg} !important; }`);

    if (border)
        rules.push(
            `${scope} .border { border-color: ${border}; }`,
            `${scope} .border-b { border-bottom-color: ${border}; }`,
            `${scope} .border-gray-400 { border-color: ${border} !important; }`,
        );
    if (borderRadius)
        rules.push(
            `${scope} .rounded, ${scope} .prose pre, ${scope} .\\32 xl\\:rounded { border-radius: ${borderRadius}px; }`,
            `${scope} .rounded:not(.inline-block) { overflow: hidden; }`,
            `${scope} .rounded-tl-none { border-top-left-radius: 0px; }`,
        );

    return rules.join('\n');
}

export function AsyncApiRenderer({ content, config, customAttributes, className, theme }: AsyncApiRendererProps) {
    const id = useId();
    const isDark = className?.split(/\s+/).includes('dark') ?? false;
    const effectiveTheme = theme ?? (isDark ? DARK_DEFAULTS : null);
    const themeStyle = effectiveTheme ? buildAsyncApiThemeStyle(id, effectiveTheme) : null;

    const activeConfigs = useMemo<AsyncApiCustomAttributesConfig[]>(() => customAttributes ?? [], [customAttributes]);
    const isEnabled = customAttributes !== undefined;

    const parsedDoc = useMemo(
        () => (isEnabled ? (loadObject(content) as Record<string, unknown> | null) : null),
        [content, isEnabled],
    );

    const version = useMemo(() => {
        const doc = parsedDoc as Record<string, unknown> | null;
        return typeof doc?.asyncapi === 'string' ? doc.asyncapi : '';
    }, [parsedDoc]);

    const effectiveConfig = useMemo((): Partial<ConfigInterface> => {
        if (!isEnabled) return config ?? {};
        const extensions = buildAsyncApiExtensionsConfig(activeConfigs, parsedDoc, version);
        return { ...config, extensions: { ...extensions, ...(config?.extensions ?? {}) } };
    }, [config, isEnabled, activeConfigs, parsedDoc, version]);

    const rootPlugin = useMemo(
        () => (isEnabled ? buildRootExtensionsPlugin(activeConfigs) : null),
        [isEnabled, activeConfigs],
    );

    const scope = `[data-renderer-id="${id}"]`;
    // Layout fixes scoped to this instance:
    // - establish the custom-attribute rows' query container on the wrapper (so all rows
    //   react to the renderer's width and collapse together);
    // - the library's long dotted event identifiers (e.g. sap.grc.irm.Foo.Create.v1) have no
    //   break opportunities, forcing a ~600px min content width; allow them to wrap so the
    //   content fits narrow panes instead of triggering a horizontal scrollbar at widths that
    //   look sufficient. overflow-x:auto stays as a safety net for genuinely unbreakable
    //   content (e.g. code blocks), pinned to the visible pane via height:100%;
    // - scrollbar-gutter:stable reserves the vertical scrollbar's width up front, so its
    //   appearance on tall docs can't squeeze the layout and induce a spurious horizontal
    //   scrollbar at widths where the content actually fits.
    // (The collapse-button chevron alignment is handled at the source: buildAsyncApiThemeStyle
    //  scopes `.rounded { overflow: hidden }` to `:not(.inline-block)` so it no longer shifts
    //  the baseline of the library's inline `rounded` example-button pills.)
    const layoutStyle =
        `${scope} { container: asyncapi-attrs / inline-size; height: 100%; overflow: auto; scrollbar-gutter: stable; }\n` +
        `${scope} :where(h1,h2,h3,h4,p,span,strong,a,li,td,div):not(pre *) { overflow-wrap: anywhere; }`;

    return (
        <div data-renderer-id={id} className={className}>
            {themeStyle && <style>{themeStyle}</style>}
            {isEnabled && <style>{customAttributeStyles}</style>}
            <style>{layoutStyle}</style>
            {isEnabled && (
                <style>{`[data-renderer-id="${id}"] #introduction .hidden { display: block !important; }`}</style>
            )}
            {/* When custom attributes are disabled, hide the library's default per-message
                "Extensions" block so message/messageTrait x-* fields are not rendered. Targets
                the anonymous Extensions wrapper div (its direct child is the `.flex.py-2` header
                containing `span.Extensions`) so header + collapsible body are removed together.
                NB: couples to asyncapi-react's internal class names — re-check on library upgrade. */}
            {!isEnabled && (
                <style>{`[data-renderer-id="${id}"] :is(#operations, #messages) div:has(> .flex.py-2 span.Extensions) { display: none; }`}</style>
            )}
            <AsyncApiComponent schema={content} config={effectiveConfig} plugins={rootPlugin ? [rootPlugin] : []} />
        </div>
    );
}
