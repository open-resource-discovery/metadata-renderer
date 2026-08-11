import { buildRendererExtraProps } from './dispatch.js';
import type { MetadataRendererOptions } from '../types.js';

const openApiConfig = [{ prefixStartsWith: 'x-sap-' }];
const asyncApiConfig = [{ prefixStartsWith: 'x-sap-' }];
const csnConfig = [{ prefixStartsWith: '@sap.' }];

describe('buildRendererExtraProps', () => {
    describe('custom attributes forwarding', () => {
        it('forwards openapi configs to openapi renderer', () => {
            const options: MetadataRendererOptions = { customAttributes: { openapi: openApiConfig } };
            expect(buildRendererExtraProps('openapi', options).customAttributes).toBe(openApiConfig);
        });

        it('forwards asyncapi configs to asyncapi renderer', () => {
            const options: MetadataRendererOptions = { customAttributes: { asyncapi: asyncApiConfig } };
            expect(buildRendererExtraProps('asyncapi', options).customAttributes).toBe(asyncApiConfig);
        });

        it('forwards csn configs to csn renderer', () => {
            const options: MetadataRendererOptions = { customAttributes: { csn: csnConfig } };
            expect(buildRendererExtraProps('csn', options).customAttributes).toBe(csnConfig);
        });

        it('omits customAttributes when disabled with false', () => {
            expect(buildRendererExtraProps('openapi', { customAttributes: false }).customAttributes).toBeUndefined();
        });

        it('omits customAttributes when options is undefined (new default — disabled)', () => {
            expect(buildRendererExtraProps('openapi', undefined).customAttributes).toBeUndefined();
        });

        it('omits customAttributes when customAttributes is absent', () => {
            expect(buildRendererExtraProps('openapi', {}).customAttributes).toBeUndefined();
        });

        it('does not cross-forward configs to a different renderer type', () => {
            const options: MetadataRendererOptions = { customAttributes: { asyncapi: asyncApiConfig } };
            expect(buildRendererExtraProps('openapi', options).customAttributes).toBeUndefined();
        });

        it('never writes showCustomAttributes — renderers derive enabled state from customAttributes presence', () => {
            const withConfigs: MetadataRendererOptions = { customAttributes: { openapi: openApiConfig } };
            expect('showCustomAttributes' in buildRendererExtraProps('openapi', withConfigs)).toBe(false);

            const disabled: MetadataRendererOptions = { customAttributes: false };
            expect('showCustomAttributes' in buildRendererExtraProps('openapi', disabled)).toBe(false);
        });
    });

    describe('protocol config passthrough', () => {
        it('forwards asyncapi config alongside custom attributes', () => {
            const config: MetadataRendererOptions['asyncapi'] = { show: { sidebar: true } };
            const props = buildRendererExtraProps('asyncapi', { asyncapi: config });
            expect(props.config).toBe(config);
        });

        it('forwards csn config', () => {
            const config = {} as MetadataRendererOptions['csn'];
            const props = buildRendererExtraProps('csn', { csn: config });
            expect(props.config).toBe(config);
        });

        it('spreads a2a options directly into props', () => {
            const props = buildRendererExtraProps('a2a', { a2a: { showValidation: true, showConnection: false } });
            expect(props.showValidation).toBe(true);
            expect(props.showConnection).toBe(false);
        });

        it('spreads mcp options directly into props', () => {
            const props = buildRendererExtraProps('mcp', { mcp: { showValidation: true } });
            expect(props.showValidation).toBe(true);
        });

        it('does not forward asyncapi config to other renderer types', () => {
            const config = {} as MetadataRendererOptions['asyncapi'];
            expect(buildRendererExtraProps('openapi', { asyncapi: config }).config).toBeUndefined();
        });
    });
});
