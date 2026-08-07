import type { JSX } from 'react';

export type AttributeDefinition =
    | { type: 'string'; label?: string; valueLinks?: Record<string, string> }
    | { type: 'boolean'; label?: string }
    | { type: 'number'; label?: string }
    | { type: 'array'; label?: string }
    | { type: 'object'; label?: string }
    | { type: 'link'; label?: string; callback: (value: unknown) => string | undefined }
    | { component: (props: unknown) => JSX.Element | null };

export type OpenApiCustomAttributesConfig = {
    prefixStartsWith?: string;
    documentationUrl?: (attributeName: string, ctx: { version: string }) => string;
    extensions?: Record<string, AttributeDefinition>;
};
