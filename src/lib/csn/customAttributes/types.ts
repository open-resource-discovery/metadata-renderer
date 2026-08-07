export type CsnAnnotationDefinition =
    | { type: 'string'; label?: string; valueLinks?: Record<string, string> }
    | { type: 'boolean'; label?: string }
    | { type: 'number'; label?: string }
    | { type: 'array'; label?: string }
    | { type: 'object'; label?: string }
    | { type: 'link'; label?: string; callback: (value: unknown) => string | undefined }
    | { render: (value: unknown) => string };

export type CsnCustomAttributesConfig = {
    prefixStartsWith?: string;
    documentationUrl?: (annotationName: string) => string;
    annotations?: Record<string, CsnAnnotationDefinition>;
};
