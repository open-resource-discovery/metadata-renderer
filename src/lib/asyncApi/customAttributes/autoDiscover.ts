type Rec = Record<string, unknown>;

const ASYNCAPI_ROOT_KEYS = new Set([
    'asyncapi',
    'info',
    'channels',
    'operations',
    'components',
    'servers',
    'tags',
    'id',
    'defaultContentType',
    'externalDocs',
]);

export function discoverAsyncApiFieldNames(doc: Rec, prefix: string): string[] {
    const names = new Set<string>();

    const addKeys = (obj: unknown) => {
        if (!obj || typeof obj !== 'object') return;
        for (const key of Object.keys(obj as Rec)) {
            if (key.startsWith(prefix)) names.add(key);
        }
    };

    // Root level
    addKeys(doc);

    // Info level
    addKeys(doc.info);

    // Channels (v2: subscribe/publish/send/receive ops + their messages; v3: messages dict)
    const channels = doc.channels as Rec | undefined;
    if (channels) {
        for (const channel of Object.values(channels)) {
            if (!channel || typeof channel !== 'object') continue;
            const ch = channel as Rec;
            addKeys(ch);
            // v2 operations
            for (const op of ['subscribe', 'publish', 'send', 'receive']) {
                const operation = ch[op] as Rec | undefined;
                if (!operation || typeof operation !== 'object') continue;
                addKeys(operation);
                addKeys(operation.message);
            }
            // v3 channel-level messages dict
            const msgs = ch.messages as Rec | undefined;
            if (msgs) {
                for (const msg of Object.values(msgs)) addKeys(msg);
            }
        }
    }

    // v3 top-level operations object
    const operations = doc.operations as Rec | undefined;
    if (operations) {
        for (const op of Object.values(operations)) addKeys(op);
    }

    // Components
    const components = doc.components as Rec | undefined;
    if (components) {
        for (const section of ['messages', 'messageTraits']) {
            const msgs = components[section] as Rec | undefined;
            if (msgs) {
                for (const msg of Object.values(msgs)) addKeys(msg);
            }
        }
        const schemas = components.schemas as Rec | undefined;
        if (schemas) {
            for (const schema of Object.values(schemas)) addKeys(schema);
        }
        // v3 component channels and operations
        const compChannels = components.channels as Rec | undefined;
        if (compChannels) {
            for (const ch of Object.values(compChannels)) addKeys(ch);
        }
        const compOps = components.operations as Rec | undefined;
        if (compOps) {
            for (const op of Object.values(compOps)) addKeys(op);
        }
    }

    return [...names];
}

export function extractRootFields(doc: Rec, prefixes: string[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(doc)) {
        if (ASYNCAPI_ROOT_KEYS.has(key)) continue;
        if (!key.startsWith('x-')) continue;
        if (prefixes.some((p) => key.startsWith(p))) {
            result[key] = value;
        }
    }
    return result;
}
