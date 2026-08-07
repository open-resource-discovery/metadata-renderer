import { getVersion } from './context.js';

describe('getVersion', () => {
    it('should return v2.0 for older swagger file', () => {
        const swaggerV2Content = `{
            "swagger": "2.0",
            "info": {
                "version": "1.0.0",
                "title": "Sample API"
            },
            "paths": {}
        }`;
        expect(getVersion(swaggerV2Content)).toBe('2.0');
    });

    it('should return the correct version for OpenAPI v3 file', () => {
        const openApiV3Content = `{
            "openapi": "3.1.1",
            "info": {
                "version": "1.0.0",
                "title": "Sample API"
            },
            "paths": {}
        }`;
        expect(getVersion(openApiV3Content)).toBe('3.1');
    });

    it('should return empty string for invalid content', () => {
        const invalidContent = `{
            "info": {
                "version": "1.0.0",
                "title": "Sample API"
            },
            "paths": {}
        }`;
        expect(getVersion(invalidContent)).toBe('');
    });
});
