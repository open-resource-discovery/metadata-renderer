import { useEffect, useId } from 'react';
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
    const { setTheme } = useTheme();
    const isDark = className?.split(/\s+/).includes('dark') ?? false;

    useEffect(() => {
        useOverlayStore.getState().setRawJson(content);
    }, [content]);

    useEffect(() => {
        setTheme(isDark ? 'dark' : 'light');
    }, [isDark, setTheme]);

    // The overlay card view renders the mobile sidebar footer as a sibling of `.overlay-root`
    // (both live inside this renderer wrapper). It carries its own `ord-ui`/`dark` classes so it
    // tracks light/dark, but the custom Theme Editor tokens are scoped to `.overlay-root.ord-ui`
    // and never reach it — so mirror those tokens onto the footer too.
    const themeStyle = theme ? buildShadcnThemeStyle('overlay-root', id, theme) : null;
    const footerThemeStyle = theme ? buildShadcnThemeStyle('overlay-sidebar-footer-mobile', id, theme) : null;
    const scope = `[data-renderer-id="${id}"] .overlay-root`;
    const scopedStyles = `
        ${scope} code {
            color: var(--ord-code-fg, var(--ord-foreground, #24292f));
            background-color: var(--ord-code-bg, var(--ord-muted, #f6f8fa));
        }
        [data-renderer-id="${id}"] .overlay-sidebar-footer-mobile {
            background: var(--ord-background);
            color: var(--ord-muted-foreground);
        }
    `;

    return (
        <div data-renderer-id={id} className="h-full">
            <style>{scopedStyles}</style>
            {themeStyle && <style>{themeStyle}</style>}
            {footerThemeStyle && <style>{footerThemeStyle}</style>}
            <OverlayCardView />
        </div>
    );
}
