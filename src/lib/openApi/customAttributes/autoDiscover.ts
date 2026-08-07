type Rec = Record<string, unknown>;
const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

export function discoverAttributeNames(doc: Rec, prefix: string): string[] {
    const names = new Set<string>();

    for (const key of Object.keys(doc)) {
        if (key.startsWith(prefix)) names.add(key);
    }

    const paths = doc.paths as Rec | undefined;
    if (paths) {
        for (const pathItem of Object.values(paths)) {
            if (!pathItem || typeof pathItem !== 'object') continue;
            for (const method of HTTP_METHODS) {
                const op = (pathItem as Rec)[method] as Rec | undefined;
                if (!op || typeof op !== 'object') continue;
                for (const key of Object.keys(op)) {
                    if (key.startsWith(prefix)) names.add(key);
                }
            }
        }
    }

    const schemas = (doc.components as Rec | undefined)?.schemas as Rec | undefined;
    if (schemas) {
        for (const schema of Object.values(schemas)) {
            if (!schema || typeof schema !== 'object') continue;
            const s = schema as Rec;
            for (const key of Object.keys(s)) {
                if (key.startsWith(prefix)) names.add(key);
            }
            const properties = s.properties as Rec | undefined;
            if (properties) {
                for (const prop of Object.values(properties)) {
                    if (!prop || typeof prop !== 'object') continue;
                    for (const key of Object.keys(prop as Rec)) {
                        if (key.startsWith(prefix)) names.add(key);
                    }
                }
            }
        }
    }

    return [...names];
}

/**
 * Synthetic property key injected into schema.properties so Scalar calls SpecificationExtension on it.
 * The value is the full schema object; our extension component reads any x-* fields from it.
 */
export const SCHEMA_ATTRS_KEY = 'x-sap-schema-attrs';

/**
 * Clone doc and inject a synthetic property into every schema object that carries
 * at least one key matching the given prefix. Scalar only calls SpecificationExtension
 * on property-level schemas, so this is the only way to render schema-level x-* fields.
 */
export function injectSchemaExtensions(doc: Rec, prefixes: string[]): Rec {
    const schemas = (doc.components as Rec | undefined)?.schemas as Rec | undefined;
    if (!schemas) return doc;

    const patchedSchemas: Rec = {};
    let anyPatched = false;

    for (const [name, schema] of Object.entries(schemas)) {
        if (!schema || typeof schema !== 'object') {
            patchedSchemas[name] = schema;
            continue;
        }
        const s = schema as Rec;
        const xFields: Rec = {};
        for (const [k, v] of Object.entries(s)) {
            if (prefixes.some((p) => k.startsWith(p))) xFields[k] = v;
        }
        if (Object.keys(xFields).length === 0) {
            patchedSchemas[name] = schema;
            continue;
        }
        anyPatched = true;
        patchedSchemas[name] = {
            ...s,
            properties: {
                // Synthetic property: value is { [SCHEMA_ATTRS_KEY]: xFields } so
                // SpecificationExtension only sees one x- key and calls only our renderer.
                [SCHEMA_ATTRS_KEY]: { [SCHEMA_ATTRS_KEY]: xFields },
                ...(s.properties as Rec | undefined),
            },
        };
    }

    if (!anyPatched) return doc;

    return {
        ...doc,
        components: {
            ...(doc.components as Rec),
            schemas: patchedSchemas,
        },
    };
}

export function extractCustomAttributeValues(doc: Rec, prefix: string): [string, unknown][] {
    const result: [string, unknown][] = [];

    for (const [k, v] of Object.entries(doc)) {
        if (k.startsWith(prefix)) result.push([k, v]);
    }

    const paths = doc.paths as Rec | undefined;
    if (paths) {
        for (const [path, pathItem] of Object.entries(paths)) {
            if (!pathItem || typeof pathItem !== 'object') continue;
            for (const method of HTTP_METHODS) {
                const op = (pathItem as Rec)[method] as Rec | undefined;
                if (!op || typeof op !== 'object') continue;
                for (const [k, v] of Object.entries(op)) {
                    if (k.startsWith(prefix)) result.push([`paths.${path}.${method}.${k}`, v]);
                }
            }
        }
    }

    const schemas = (doc.components as Rec | undefined)?.schemas as Rec | undefined;
    if (schemas) {
        for (const [schemaName, schema] of Object.entries(schemas)) {
            if (!schema || typeof schema !== 'object') continue;
            const s = schema as Rec;
            for (const [k, v] of Object.entries(s)) {
                if (k.startsWith(prefix)) result.push([`components.schemas.${schemaName}.${k}`, v]);
            }
            const properties = s.properties as Rec | undefined;
            if (properties) {
                for (const [propName, prop] of Object.entries(properties)) {
                    if (!prop || typeof prop !== 'object') continue;
                    for (const [k, v] of Object.entries(prop as Rec)) {
                        if (k.startsWith(prefix)) {
                            result.push([`components.schemas.${schemaName}.properties.${propName}.${k}`, v]);
                        }
                    }
                }
            }
        }
    }

    return result;
}
