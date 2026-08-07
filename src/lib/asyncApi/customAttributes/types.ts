import type { ComponentType } from 'react';
import type { ExtensionComponentProps } from '@asyncapi/react-component';

export type AsyncApiAttributeDefinition =
    | { type: 'string'; label?: string; valueLinks?: Record<string, string> }
    | { type: 'boolean'; label?: string }
    | { type: 'number'; label?: string }
    | { type: 'array'; label?: string }
    | { type: 'object'; label?: string }
    | { type: 'link'; label?: string; callback: (value: unknown) => string | undefined }
    | { component: ComponentType<ExtensionComponentProps> };

export type AsyncApiCustomAttributesConfig = {
    prefixStartsWith?: string;
    documentationUrl?: (attributeName: string, ctx: { version: string }) => string;
    extensions?: Record<string, AsyncApiAttributeDefinition>;
};
