import { useEffect, useState } from 'react';
import { generateHtml, type CsnRendererConfig, type AnnotationLinkCallbacks } from '@sap/csn-interop-renderer';
import styles from './styles';
import type { RendererTheme } from '../types';
import type { CsnCustomAttributesConfig } from './customAttributes/types';
import { applyAnnotationRenderers } from './customAttributes/postProcess';
import { loadObject } from '../core/utils';

function buildAnnotationLinkCallbacks(configs: CsnCustomAttributesConfig[]): AnnotationLinkCallbacks {
    const callbacks: AnnotationLinkCallbacks = {};
    for (const config of configs) {
        for (const [key, def] of Object.entries(config.annotations ?? {})) {
            if ('type' in def && def.type === 'link' && 'callback' in def && !(key in callbacks)) {
                const cb = def.callback;
                callbacks[key] = (value: unknown) => cb(value) ?? '';
            }
        }
    }
    return callbacks;
}

export type CsnRendererProps = {
    content: string;
    config?: CsnRendererConfig;
    customAttributes?: CsnCustomAttributesConfig[];
    className?: string;
    theme?: RendererTheme;
};

type State =
    { kind: 'idle' } | { kind: 'loading' } | { kind: 'ready'; html: string } | { kind: 'error'; message: string };

export function CsnRenderer({ content, config, customAttributes, className, theme }: CsnRendererProps) {
    const [state, setState] = useState<State>({ kind: 'idle' });

    useEffect(() => {
        if (!content) {
            setState({ kind: 'idle' });
            return;
        }

        let cancelled = false;
        setState({ kind: 'loading' });

        let parsed: unknown;
        try {
            parsed = JSON.parse(content);
        } catch (e) {
            setState({ kind: 'error', message: String(e) });
            return;
        }

        const activeConfigs: CsnCustomAttributesConfig[] = customAttributes ?? [];
        const isEnabled = customAttributes !== undefined;
        const parsedDoc = isEnabled ? (loadObject(content) as Record<string, unknown> | null) : null;

        const linkCallbacks = isEnabled ? buildAnnotationLinkCallbacks(activeConfigs) : {};
        const rendererConfig: CsnRendererConfig = {
            ...config,
            annotationLinkCallbacks: { ...linkCallbacks, ...config?.annotationLinkCallbacks },
        };

        generateHtml(parsed as Parameters<typeof generateHtml>[0], rendererConfig)
            .then((html: string) => {
                const processed = isEnabled ? applyAnnotationRenderers(html, activeConfigs, parsedDoc) : html;
                if (!cancelled) setState({ kind: 'ready', html: processed });
            })
            .catch((e: unknown) => {
                if (!cancelled) setState({ kind: 'error', message: String(e) });
            });

        return () => {
            cancelled = true;
        };
    }, [content, config, customAttributes]);

    return (
        <div className={`csn-root${className ? ` ${className}` : ''}`} style={theme}>
            <style>{styles}</style>
            {state.kind === 'ready' && <div className="p-4" dangerouslySetInnerHTML={{ __html: state.html }} />}
            {state.kind === 'error' && (
                <div>
                    <h1>Invalid CSN</h1>
                    <div>{state.message}</div>
                </div>
            )}
        </div>
    );
}
