import type { MetaType } from './utils';
import type { MetadataRendererOptions } from '../types';

export function buildRendererExtraProps(
    metaType: MetaType,
    options: MetadataRendererOptions | undefined,
): Record<string, unknown> {
    const extraProps: Record<string, unknown> = {};
    const customAttributes = options?.customAttributes;
    const ca = customAttributes !== false ? customAttributes : undefined;
    if (metaType === 'openapi') {
        if (ca?.openapi) extraProps.customAttributes = ca.openapi;
    }
    if (metaType === 'asyncapi') {
        if (options?.asyncapi) Object.assign(extraProps, { config: options.asyncapi });
        if (ca?.asyncapi) extraProps.customAttributes = ca.asyncapi;
    }
    if (metaType === 'csn') {
        if (options?.csn) Object.assign(extraProps, { config: options.csn });
        if (ca?.csn) extraProps.customAttributes = ca.csn;
    }
    if (metaType === 'a2a' && options?.a2a) Object.assign(extraProps, options.a2a);
    if (metaType === 'mcp' && options?.mcp) Object.assign(extraProps, options.mcp);
    return extraProps;
}
