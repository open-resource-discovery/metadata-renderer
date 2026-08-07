import type { AsyncApiCustomAttributesConfig } from './types';

export const asyncApiContext: {
    version: string;
    configs: AsyncApiCustomAttributesConfig[];
    rootFields: Record<string, unknown>;
    getDocumentationUrl(fieldName: string): string | undefined;
} = {
    version: '',
    configs: [],
    rootFields: {},
    getDocumentationUrl(fieldName: string): string | undefined {
        const matching =
            this.configs.find((c) => c.extensions?.[fieldName]) ??
            this.configs.find((c) => c.prefixStartsWith && fieldName.startsWith(c.prefixStartsWith));
        return matching?.documentationUrl?.(fieldName, { version: this.version });
    },
};
