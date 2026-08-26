import { parse } from 'yaml';
import type { RendererTheme } from '../types';

export type MetaType = 'csn' | 'openapi' | 'asyncapi' | 'overlay' | 'a2a' | 'mcp' | 'unknown';

export function loadObject(content: string): undefined | object {
    if (!content) return;

    let object: unknown;
    if (content.charAt(0) === '{') {
        try {
            object = JSON.parse(content);
        } catch (e) {
            // eslint-disable-next-line no-console -- surfacing parse failures to the host page is intentional.
            console.error(e);
            return;
        }
    } else {
        try {
            object = parse(content);
        } catch (e) {
            // eslint-disable-next-line no-console -- surfacing parse failures to the host page is intentional.
            console.error(e);
            return;
        }
    }

    if (!object || typeof object !== 'object') {
        return;
    }

    return object;
}

// Detection runs in priority order; the first match wins.
// Order: csn -> openapi -> asyncapi -> overlay -> mcp -> a2a -> unknown.
// MCP is checked before A2A because both carry a `capabilities` object,
// but `supportedProtocolVersions` is unique to MCP and not present in A2A.
export function detectMetaType(content: string): MetaType {
    const object = loadObject(content);
    if (!object) return 'unknown';
    const o = object as Record<string, unknown>;

    if (typeof o.csnInteropEffective === 'string') {
        return 'csn';
    }

    if (typeof o.openapi === 'string' || typeof o.swagger === 'string') {
        return 'openapi';
    }

    if (typeof o.asyncapi === 'string') {
        return 'asyncapi';
    }

    if (typeof o.ordOverlay === 'string' && Array.isArray(o.patches)) {
        return 'overlay';
    }

    if (Array.isArray(o.supportedProtocolVersions)) {
        return 'mcp';
    }

    if (typeof o.capabilities === 'object' && o.capabilities !== null && Array.isArray(o.skills)) {
        return 'a2a';
    }

    return 'unknown';
}

export function extractVersion(type: MetaType, content: string): string {
    const o = loadObject(content) as Record<string, unknown> | undefined;
    if (!o) return '';
    switch (type) {
        case 'openapi':
            if (typeof o.openapi === 'string') return o.openapi;
            if (typeof o.swagger === 'string') return '2.0';
            return '';
        case 'asyncapi':
            return typeof o.asyncapi === 'string' ? o.asyncapi : '';
        case 'overlay':
            return typeof o.ordOverlay === 'string' ? o.ordOverlay : '';
        case 'a2a':
            if (typeof o.protocolVersion === 'string') return o.protocolVersion;
            if (Array.isArray(o.supportedInterfaces) && o.supportedInterfaces.length > 0) {
                const first = o.supportedInterfaces[0] as Record<string, unknown>;
                return typeof first.protocolVersion === 'string' ? first.protocolVersion : '1.0.0';
            }
            return '0.3.0';
        case 'csn':
            if (typeof o.$version === 'string') return o.$version;
            return '';
        case 'mcp':
            return Array.isArray(o.supportedProtocolVersions) && typeof o.supportedProtocolVersions[0] === 'string'
                ? o.supportedProtocolVersions[0]
                : '';
        default:
            return '';
    }
}

const SHADCN_DERIVED: Array<[string, string]> = [
    ['--ord-card', '--ord-background'],
    ['--ord-card-foreground', '--ord-foreground'],
    ['--ord-popover', '--ord-background'],
    ['--ord-popover-foreground', '--ord-foreground'],
];

export function mapShadcnTheme(theme: RendererTheme): Record<string, string> {
    const resolved: Record<string, string> = { ...(theme as Record<string, string>) };
    for (const [derived, source] of SHADCN_DERIVED) {
        if (!(derived in resolved) && source in resolved) {
            resolved[derived] = resolved[source];
        }
    }
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(resolved)) {
        const formatted = k === '--ord-radius' ? `${v}px` : v;
        out[k] = formatted;
        if (k.startsWith('--ord-')) out[k.replace('--ord-', '--')] = formatted;
    }
    return out;
}

export function buildShadcnThemeStyle(rootClass: string, id: string, theme: RendererTheme): string {
    const mapped = mapShadcnTheme(theme);
    const declarations = Object.entries(mapped)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');
    return `[data-renderer-id="${id}"] .${rootClass}.ord-ui { ${declarations} }`;
}
