// Minimal MCP Server Card fixture. Matches the v1 protocol shape:
// requires $schema, name, version, description, supportedProtocolVersions,
// remotes, capabilities.
export const mcp = JSON.stringify(
    {
        $schema: 'https://static.modelcontextprotocol.io/schemas/2025-06-18/server-card.json',
        name: 'demo-mcp-server',
        title: 'Demo MCP Server',
        version: '1.0.0',
        description: 'A minimal MCP server card used for the metadata-renderer demo.',
        supportedProtocolVersions: ['2025-06-18'],
        remotes: [
            {
                type: 'http',
                url: 'https://example.com/mcp',
            },
        ],
        capabilities: {
            tools: { listChanged: true },
            resources: { listChanged: true, subscribe: true },
            prompts: { listChanged: false },
        },
        tools: [
            {
                name: 'get_weather',
                description: 'Get the current weather for a given location.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        location: { type: 'string', description: 'City name or zip code' },
                        units: { type: 'string', enum: ['celsius', 'fahrenheit'], description: 'Temperature unit' },
                    },
                    required: ['location'],
                },
            },
            {
                name: 'search_web',
                description: 'Search the web and return a list of relevant results.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Search query' },
                        limit: { type: 'number', description: 'Maximum number of results to return' },
                    },
                    required: ['query'],
                },
            },
        ],
        resources: [
            {
                uri: 'file:///docs/readme.md',
                name: 'README',
                description: 'Project readme and getting-started guide.',
                mimeType: 'text/markdown',
            },
            {
                uri: 'config://app/settings',
                name: 'App Settings',
                description: 'Current application configuration.',
                mimeType: 'application/json',
            },
        ],
        prompts: [
            {
                name: 'summarize',
                description: 'Summarize the provided text in a few sentences.',
                arguments: [
                    { name: 'text', description: 'Text to summarize', required: true },
                    { name: 'style', description: 'Summary style: brief, detailed, or bullet-points', required: false },
                ],
            },
            {
                name: 'translate',
                description: 'Translate text to a target language.',
                arguments: [
                    { name: 'text', description: 'Text to translate', required: true },
                    { name: 'target_language', description: 'Target language (e.g. French, Japanese)', required: true },
                ],
            },
        ],
    },
    null,
    2,
);
