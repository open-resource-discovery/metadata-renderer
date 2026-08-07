import { useEffect, useId } from 'react';
import { MCPServerCardView, useServerCardStore } from '@open-resource-discovery/mcp-server-card-ui/card-view';
import { useTheme } from '@open-resource-discovery/mcp-server-card-ui';
import '@open-resource-discovery/mcp-server-card-ui/styles';
import { buildShadcnThemeStyle } from '../core/utils';
import type { RendererTheme } from '../types';

export type McpRendererProps = {
    content: string;
    showValidation?: boolean;
    className?: string;
    theme?: RendererTheme;
};

export function McpRenderer({ content, showValidation = false, className, theme }: McpRendererProps) {
    const id = useId();
    const { setTheme } = useTheme();
    const isDark = className?.split(/\s+/).includes('dark') ?? false;

    useEffect(() => {
        useServerCardStore.getState().setRawJson(content);
    }, [content]);

    useEffect(() => {
        setTheme(isDark ? 'dark' : 'light');
    }, [isDark, setTheme]);

    const themeStyle = theme ? buildShadcnThemeStyle('mcp-root', id, theme) : null;

    return (
        <div data-renderer-id={id} className="h-full">
            {themeStyle && <style>{themeStyle}</style>}
            <MCPServerCardView readOnly showValidation={showValidation} />
        </div>
    );
}
