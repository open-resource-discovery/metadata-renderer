// Minimal A2A AgentCard fixture for the demo. Matches the v1 protocol shape:
// requires name, version, capabilities, skills.
export const a2a = JSON.stringify(
    {
        name: 'Echo Agent',
        description: 'Echoes whatever you send it. Useful for testing the A2A renderer.',
        version: '1.0.0',
        url: 'https://example.com/agents/echo',
        capabilities: {
            streaming: true,
            pushNotifications: false,
            stateTransitionHistory: false,
        },
        defaultInputModes: ['text/plain'],
        defaultOutputModes: ['text/plain'],
        skills: [
            {
                id: 'echo',
                name: 'echo',
                description: 'Returns the input message verbatim.',
                tags: ['demo', 'echo'],
                examples: ['hello', 'world'],
            },
        ],
    },
    null,
    2,
);
