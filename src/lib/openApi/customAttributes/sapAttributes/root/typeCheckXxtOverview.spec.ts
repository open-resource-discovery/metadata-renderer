import { typeCheckExSapExtOverviewExSapExtOverview } from './typeCheckXxtOverview.js';

describe('Type Check ExtOverviewProps', () => {
    it('should return true if object is valid', () => {
        const validObj = {
            xSapExtOverview: [
                {
                    name: 'Extension1',
                    values: 'This is a simple string value',
                },
                {
                    name: 'Extension2',
                    values: ['String value 1', 'String value 2'],
                },
            ],
        };
        expect(typeCheckExSapExtOverviewExSapExtOverview(validObj)).toBe(true);
    });
    it('should return false for valid object with mixed values', () => {
        const validObj = {
            xSapExtOverview: [
                {
                    name: 'Extension1',
                    values: [
                        'String value',
                        { text: 'Markdown value', format: 'markdown' },
                        { text: 'Plain text value', format: 'plain' },
                    ],
                },
            ],
        };
        expect(typeCheckExSapExtOverviewExSapExtOverview(validObj)).toBe(false);
    });
    it('should return false for invalid object structure', () => {
        const invalidObj = {
            xSapExtOverview: [
                {
                    name: 'Extension1',
                    value: 'This is a simple string value', // Note the typo here: 'value' instead of 'values'
                },
            ],
        };
        expect(typeCheckExSapExtOverviewExSapExtOverview(invalidObj)).toBe(false);
    });
    it('should return false for non-object input', () => {
        const nonObjectInput = 'This is a string, not an object';
        expect(typeCheckExSapExtOverviewExSapExtOverview(nonObjectInput)).toBe(false);
    });
    it('should return false for null input', () => {
        const nullInput = null;
        expect(typeCheckExSapExtOverviewExSapExtOverview(nullInput)).toBe(false);
    });
    it('should return false for undefined input', () => {
        const undefinedInput = undefined;
        expect(typeCheckExSapExtOverviewExSapExtOverview(undefinedInput)).toBe(false);
    });
    it('should return false if xSapExtOverview is missing', () => {
        const missingProperty = {};
        expect(typeCheckExSapExtOverviewExSapExtOverview(missingProperty)).toBe(false);
    });
    it('should return false for non-object input', () => {
        const nonObjectInput = 'This is a string, not an object';
        expect(typeCheckExSapExtOverviewExSapExtOverview(nonObjectInput)).toBe(false);
    });
    it('should return false if name is not a string', () => {
        const invalidNameType = {
            xSapExtOverview: [
                {
                    name: 123, // Invalid type
                    values: 'This is a simple string value',
                },
            ],
        };
        expect(typeCheckExSapExtOverviewExSapExtOverview(invalidNameType)).toBe(false);
    });
    it('should return false if values is no array', () => {
        const invalidNameType = {
            xSapExtOverview: [
                {
                    name: 123, // Invalid type
                    values: {},
                },
            ],
        };
        expect(typeCheckExSapExtOverviewExSapExtOverview(invalidNameType)).toBe(false);
    });
});
