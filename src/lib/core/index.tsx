import { useMemo } from 'react';
import { detectMetaType, extractVersion, type MetaType } from './utils';
import type { RendererTheme, RendererMap, MetadataRendererOptions } from '../types';
import { OpenApiRenderer } from '../openApi';
import { CsnRenderer } from '../csn';
import { AsyncApiRenderer } from '../asyncApi';
import { A2ARenderer } from '../a2a';
import { McpRenderer } from '../mcp';

const DEFAULT_RENDERERS: RendererMap = {
    openapi: OpenApiRenderer,
    csn: CsnRenderer,
    asyncapi: AsyncApiRenderer,
    a2a: A2ARenderer,
    mcp: McpRenderer,
};

export type MetadataRendererProps = {
    content: string;
    renderers?: RendererMap;
    options?: MetadataRendererOptions;
    type?: MetaType;
    className?: string;
    theme?: RendererTheme;
};

const PROTOCOL_LABELS: Partial<Record<MetaType, string>> = {
    openapi: 'OpenAPI',
    csn: 'CSN',
    asyncapi: 'AsyncAPI',
    a2a: 'A2A',
    mcp: 'MCP',
};

export function MetadataRenderer({ content, renderers, options, type, className, theme }: MetadataRendererProps) {
    const activeRenderers = renderers ?? DEFAULT_RENDERERS;
    const autoDetect = options?.autoDetect !== false;
    const strictTypeCheck = options?.strictTypeCheck !== false;

    const metaType = useMemo(() => {
        if (type) return type;
        if (!autoDetect) return 'unknown' as MetaType;
        return detectMetaType(content);
    }, [type, autoDetect, content]);

    const detectedType = useMemo(() => {
        if (!type || !content) return null;
        return detectMetaType(content);
    }, [type, content]);

    const isMismatch =
        detectedType !== null && detectedType !== type && (detectedType !== 'unknown' || strictTypeCheck);

    const version = useMemo(() => extractVersion(metaType, content), [metaType, content]);
    const label = PROTOCOL_LABELS[metaType];

    const RendererComponent = activeRenderers[metaType];

    let renderer: React.ReactNode;
    if (isMismatch) {
        const detectedLabel =
            detectedType === 'unknown'
                ? 'an unrecognised format'
                : `‘${PROTOCOL_LABELS[detectedType!] ?? detectedType}’`;
        renderer = (
            <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
                <strong>Type mismatch:</strong> content was detected as {detectedLabel} but &lsquo;
                {PROTOCOL_LABELS[type!] ?? type}&rsquo; was specified.
            </div>
        );
    } else if (RendererComponent) {
        const extraProps: Record<string, unknown> = {};
        if (metaType === 'openapi') {
            if (options?.customAttributes === false || options?.showSAPCustomFields === false) {
                extraProps.showCustomAttributes = false;
            } else if (options?.customAttributes?.openapi) {
                extraProps.customAttributes = options.customAttributes.openapi;
            }
        }
        if (metaType === 'asyncapi') {
            if (options?.asyncapi) Object.assign(extraProps, { config: options.asyncapi });
            if (options?.customAttributes === false) {
                extraProps.showCustomAttributes = false;
            } else if (options?.customAttributes?.asyncapi) {
                extraProps.customAttributes = options.customAttributes.asyncapi;
            }
        }
        if (metaType === 'csn') {
            if (options?.csn) Object.assign(extraProps, { config: options.csn });
            if (options?.customAttributes === false) {
                extraProps.showCustomAttributes = false;
            } else if (options?.customAttributes?.csn) {
                extraProps.customAttributes = options.customAttributes.csn;
            }
        }
        if (metaType === 'a2a' && options?.a2a) Object.assign(extraProps, options.a2a);
        if (metaType === 'mcp' && options?.mcp) Object.assign(extraProps, options.mcp);

        renderer = <RendererComponent content={content} className={className} theme={theme} {...extraProps} />;
    } else if (options?.fallback === 'raw') {
        renderer = <pre style={{ margin: 0, padding: 16, overflow: 'auto', height: '100%' }}>{content}</pre>;
    } else {
        renderer = (
            <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
                <strong>Unsupported format:</strong> No renderer registered for type &lsquo;{metaType}&rsquo;.
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', height: '100%', ...theme }}>
            {label && (
                <div
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontFamily: 'system-ui, sans-serif',
                        lineHeight: '16px',
                        pointerEvents: 'none',
                        background: 'var(--ord-muted, #e5e7eb)',
                        color: 'var(--ord-muted-foreground, #6b7280)',
                    }}
                >
                    {label}
                    {version ? ` · ${version}` : ''}
                </div>
            )}
            {renderer}
        </div>
    );
}
