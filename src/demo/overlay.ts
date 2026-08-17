// Minimal ORD Overlay 0.1 fixture for the demo. Matches the schema:
// requires `ordOverlay` (version string) and `patches` (array).
export const overlay = JSON.stringify(
    {
        $schema: 'https://open-resource-discovery.org/spec-v1/interfaces/OrdOverlay.schema.json#',
        ordOverlay: '0.1',
        ordId: 'sap.foo:overlay:astronomy-api:v1',
        description:
            'Adds deprecation notices and supplementary documentation to the Astronomy REST API without modifying the original OpenAPI specification.',
        describedSystemType: { systemNamespace: 'sap.foo' },
        visibility: 'internal',
        target: {
            ordId: 'sap.foo:apiResource:astronomy:v1',
            url: '/ord/metadata/astronomy-v1.oas3.json',
            definitionType: 'openapi-v3',
        },
        meta: {
            sourceSystem: 'AI Enrichment Pipeline v2.1',
            enrichmentDate: '2026-04-01',
        },
        patches: [
            {
                description: 'Mark the legacy endpoint as deprecated.',
                action: 'merge',
                selector: { operation: 'getConstellationByAbbreviation' },
                data: {
                    deprecated: true,
                    'x-deprecation-notice':
                        'Use getConstellationByIAUCode instead. This operation will be removed in v2.',
                },
            },
            {
                description: 'Add an OAuth2 security scheme at the document root.',
                action: 'merge',
                selector: { root: true },
                data: {
                    info: {
                        contact: {
                            name: 'Astronomy API Support',
                            email: 'astronomy-api@example.com',
                        },
                    },
                },
            },
        ],
    },
    null,
    2,
);
