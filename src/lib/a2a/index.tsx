import { useEffect, useId } from 'react';
import { AgentCardView, useAgentCardStore, useTheme } from '@open-resource-discovery/a2a-editor/card-view';
import '@open-resource-discovery/a2a-editor/styles';
import { buildShadcnThemeStyle } from '../core/utils';
import type { RendererTheme } from '../types';

// eslint-disable-next-line @typescript-eslint/naming-convention -- "A2A" is the protocol name; keeping the acronym uppercase in the public API.
export type A2ARendererProps = {
    content: string;
    showValidation?: boolean;
    showConnection?: boolean;
    className?: string;
    theme?: RendererTheme;
};

// eslint-disable-next-line @typescript-eslint/naming-convention -- "A2A" is the protocol name; keeping the acronym uppercase in the public API.
export function A2ARenderer({
    content,
    showValidation = false,
    showConnection = false,
    className,
    theme,
}: A2ARendererProps) {
    const id = useId();
    const { setTheme } = useTheme();
    const isDark = className?.split(/\s+/).includes('dark') ?? false;

    useEffect(() => {
        useAgentCardStore.getState().setRawJson(content);
    }, [content]);

    useEffect(() => {
        setTheme(isDark ? 'dark' : 'light');
    }, [isDark, setTheme]);

    const themeStyle = theme ? buildShadcnThemeStyle('a2a-root', id, theme) : null;

    return (
        <div data-renderer-id={id} className="h-full">
            {themeStyle && <style>{themeStyle}</style>}
            <AgentCardView readOnly showValidation={showValidation} showConnection={showConnection} />
        </div>
    );
}
