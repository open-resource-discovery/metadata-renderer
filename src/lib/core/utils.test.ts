/* eslint-disable no-console -- tests stub console.error to assert it was called. */
import { vi } from 'vitest';
import { detectMetaType, loadObject } from './utils.js';

describe('loadObject', () => {
    it('should return undefined for empty content', () => {
        expect(loadObject('')).toBeUndefined();
    });

    it('should return undefined for invalid JSON', () => {
        const invalidJson = '{ invalid json ';
        console.error = vi.fn();
        expect(loadObject(invalidJson)).toBeUndefined();
        expect(console.error).toHaveBeenCalled();
    });

    it('should parse valid JSON content', () => {
        const validJson = '{"key": "value"}';
        const result = loadObject(validJson);
        expect(result).toEqual({ key: 'value' });
    });

    it('should parse valid YAML content', () => {
        const validYaml = `
        key: value
        `;
        const result = loadObject(validYaml);
        expect(result).toEqual({ key: 'value' });
    });
});

describe('detectMetaType', () => {
    it('should return unknown for empty content', () => {
        expect(detectMetaType('')).toBe('unknown');
    });

    it('should return unknown for invalid JSON', () => {
        const invalidJson = '{ invalid json ';
        console.error = vi.fn();
        expect(detectMetaType(invalidJson)).toBe('unknown');
        expect(console.error).toHaveBeenCalled();
    });

    it('should detect CSN from JSON content', () => {
        const csnJson = JSON.stringify({ csnInteropEffective: 'some value' });
        expect(detectMetaType(csnJson)).toBe('csn');
    });

    it('should detect CSN from YAML content', () => {
        const csnYaml = `
        csnInteropEffective: some value
        `;
        expect(detectMetaType(csnYaml)).toBe('csn');
    });

    it('should detect OpenAPI from JSON content', () => {
        const openApiJson = JSON.stringify({ openapi: '3.0.0' });
        expect(detectMetaType(openApiJson)).toBe('openapi');
    });

    it('should detect OpenAPI from YAML content', () => {
        const openApiYaml = `
        swagger: 2.0.0
        `;
        expect(detectMetaType(openApiYaml)).toBe('openapi');
    });

    it('should detect AsyncAPI', () => {
        const asyncApiJson = JSON.stringify({ asyncapi: '2.6.0' });
        expect(detectMetaType(asyncApiJson)).toBe('asyncapi');
    });

    it('should detect MCP server card by supportedProtocolVersions', () => {
        const mcp = JSON.stringify({
            $schema: 'https://static.modelcontextprotocol.io/schemas/server-card.json',
            name: 'demo',
            version: '1.0.0',
            description: 'demo server',
            supportedProtocolVersions: ['2025-06-18'],
            remotes: [],
            capabilities: {},
        });
        expect(detectMetaType(mcp)).toBe('mcp');
    });

    it('should detect MCP server card without $schema', () => {
        const mcp = JSON.stringify({
            name: 'demo',
            version: '1.0.0',
            supportedProtocolVersions: ['2025-06-18'],
            remotes: [],
            capabilities: {},
        });
        expect(detectMetaType(mcp)).toBe('mcp');
    });

    it('should detect A2A agent card by capabilities + skills array', () => {
        const a2a = JSON.stringify({
            name: 'demo agent',
            version: '1.0.0',
            capabilities: { streaming: true },
            skills: [{ id: 's1', name: 'echo', description: 'echoes input' }],
        });
        expect(detectMetaType(a2a)).toBe('a2a');
    });

    it('should prefer MCP over A2A when both shapes overlap', () => {
        // Both have a `capabilities` object; only MCP carries $schema + supportedProtocolVersions.
        const ambiguous = JSON.stringify({
            $schema: 'https://schemas.modelcontextprotocol.io/server-card.json',
            supportedProtocolVersions: ['2025-06-18'],
            capabilities: {},
            skills: [],
        });
        expect(detectMetaType(ambiguous)).toBe('mcp');
    });
});
