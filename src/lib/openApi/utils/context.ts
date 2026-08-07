import { loadObject } from '../../core/utils';
import type { OpenApiCustomAttributesConfig } from '../customAttributes/types';

// Scalar does not support React context providers, so we use a mutable singleton
// that is updated synchronously in the useMemo before Scalar renders.
export const openApiContext: {
    version: string;
    configs: OpenApiCustomAttributesConfig[];
    getDocumentationUrl(attributeName: string): string | undefined;
} = {
    version: '',
    configs: [],
    getDocumentationUrl(attributeName: string): string | undefined {
        const matching =
            this.configs.find((c) => c.extensions?.[attributeName]) ??
            this.configs.find((c) => c.prefixStartsWith && attributeName.startsWith(c.prefixStartsWith));
        return matching?.documentationUrl?.(attributeName, { version: this.version });
    },
};

export const getVersion = (content: string): string => {
    const parsedContent = loadObject(content);
    if (!parsedContent) return '';

    if ('openapi' in parsedContent && parsedContent.openapi && typeof parsedContent.openapi === 'string') {
        return parsedContent.openapi.substring(0, 3);
    }
    if ('swagger' in parsedContent && parsedContent.swagger && typeof parsedContent.swagger === 'string') {
        return '2.0';
    }
    return '';
};
