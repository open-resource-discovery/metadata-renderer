import { useEffect, useId, useRef } from 'react';
import { OverlayCardView, useOverlayStore, useTheme } from '@open-resource-discovery/overlay-editor/card-view';
import '@open-resource-discovery/overlay-editor/styles';
import { buildShadcnThemeStyle } from '../core/utils';
import type { RendererTheme } from '../types';

export type OverlayRendererProps = {
    content: string;
    className?: string;
    theme?: RendererTheme;
};

export function OverlayRenderer({ content, className, theme }: OverlayRendererProps) {
    const id = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const { setTheme } = useTheme();
    const isDark = className?.split(/\s+/).includes('dark') ?? false;

    useEffect(() => {
        useOverlayStore.getState().setRawJson(content);
    }, [content]);

    useEffect(() => {
        setTheme(isDark ? 'dark' : 'light');
    }, [isDark, setTheme]);

    // The overlay card view hardcodes the sidebar height to 100dvh (viewport), which overflows
    // when embedded in a non-fullscreen container (e.g. Docusaurus) and pushes the sidebar footer
    // below the fold. Measure the actual container height and expose it as a CSS var the override
    // rule below consumes.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            el.style.setProperty('--overlay-container-height', `${entry.contentRect.height}px`);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const themeStyle = theme ? buildShadcnThemeStyle('overlay-root', id, theme) : null;
    // Override the library's `.overlay-sidebar-inner { height: 100dvh }` with our measured height,
    // scoped to this renderer instance. Specificity (0,3,0) beats the library's (0,1,0) rule.
    const layoutStyle =
        `[data-renderer-id="${id}"] .overlay-root .overlay-sidebar-inner { ` +
        `height: var(--overlay-container-height, 100dvh); }`;

    return (
        <div ref={containerRef} data-renderer-id={id} className="h-full">
            <style>{layoutStyle}</style>
            {themeStyle && <style>{themeStyle}</style>}
            <OverlayCardView />
        </div>
    );
}
