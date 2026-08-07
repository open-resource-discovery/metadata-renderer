import type { ComponentType } from 'react';
import type { CsnRendererConfig } from '@sap/csn-interop-renderer';
import type { ConfigInterface } from '@asyncapi/react-component';
import type { MetaType } from './core/utils';
import type { OpenApiCustomAttributesConfig } from './openApi/customAttributes/types';
import type { AsyncApiCustomAttributesConfig } from './asyncApi/customAttributes/types';
import type { CsnCustomAttributesConfig } from './csn/customAttributes/types';

export type CustomAttributesOptions = {
    openapi?: OpenApiCustomAttributesConfig[];
    asyncapi?: AsyncApiCustomAttributesConfig[];
    csn?: CsnCustomAttributesConfig[];
};

export type RendererTheme = Partial<Record<`--ord-${string}`, string>>;

export type RendererEntry = ComponentType<{
    content: string;
    className?: string;
    theme?: RendererTheme;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}>;

export type RendererMap = Partial<Record<MetaType, RendererEntry>>;

export type MetadataRendererOptions = {
    /** Auto-detect format from content when `type` prop is absent. Default: true. */
    autoDetect?: boolean;
    /** What to show for unresolved/disabled types. Default: 'error'. */
    fallback?: 'error' | 'raw';
    /**
     * When `type` is explicitly set and content is not detected as that type,
     * show an error instead of passing content to the renderer. Default: true.
     */
    strictTypeCheck?: boolean;
    /** @deprecated Use `customAttributes.openapi` instead. */
    showSAPCustomFields?: boolean;
    /** Custom attribute renderers per protocol. Pass `false` to disable all. Default: SAP preset for OpenAPI. */
    customAttributes?: CustomAttributesOptions | false;
    /** Passed through to CsnRenderer. */
    csn?: CsnRendererConfig;
    /** Passed through to AsyncApiRenderer. */
    asyncapi?: Partial<ConfigInterface>;
    /** Passed through to A2ARenderer. */
    a2a?: { showValidation?: boolean; showConnection?: boolean };
    /** Passed through to McpRenderer. */
    mcp?: { showValidation?: boolean };
};
