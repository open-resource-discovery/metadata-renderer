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

    const themeStyle = theme ? buildShadcnThemeStyle('overlay-root', id, theme) : null;

    return (
        <div data-renderer-id={id} className="h-full">
            {themeStyle && <style>{themeStyle}</style>}
            <OverlayCardView />
        </div>
    );
}
