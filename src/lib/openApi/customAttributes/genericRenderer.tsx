import type { JSX } from 'react';
import Markdown from 'react-markdown';
import type { AttributeDefinition, OpenApiCustomAttributesConfig } from './types';
import AttributeLink from './attributeLink';

function autoLabel(fieldName: string, prefix?: string): string {
    let name = fieldName;
    if (prefix && name.startsWith(prefix)) name = name.slice(prefix.length);
    return name
        .split('-')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function kebabToCamel(str: string): string {
    return str.replace(/-./g, (x) => x[1].toUpperCase());
}

function getValueKey(fieldName: string): string {
    return kebabToCamel(fieldName);
}

function extractValue(data: unknown, fieldName: string): unknown {
    if (!data || typeof data !== 'object') return undefined;
    const key = getValueKey(fieldName);
    return (data as Record<string, unknown>)[key];
}

function Label({ name, label }: { name: string; label: string }): JSX.Element {
    return (
        <div className="sap-api-label">
            {label} <AttributeLink attributeName={name} />
        </div>
    );
}

function StringRenderer(props: {
    name: string;
    label: string;
    value: string;
    valueLinks?: Record<string, string>;
}): JSX.Element {
    const link = props.valueLinks?.[props.value];
    return (
        <div className="sap-api-container">
            <Label name={props.name} label={props.label} />
            <p className="sap-api-value">
                {link ? (
                    <a href={link} rel="noreferrer noopener" target="_blank" className="sap-api-link">
                        {props.value}
                    </a>
                ) : (
                    props.value
                )}
            </p>
        </div>
    );
}

function BooleanRenderer(props: { name: string; label: string; value: boolean }): JSX.Element {
    return (
        <div className="sap-api-container">
            <Label name={props.name} label={props.label} />
            <p className="sap-api-value">{props.value ? 'Yes' : 'No'}</p>
        </div>
    );
}

function NumberRenderer(props: { name: string; label: string; value: number }): JSX.Element {
    return (
        <div className="sap-api-container">
            <Label name={props.name} label={props.label} />
            <p className="sap-api-value">{props.value}</p>
        </div>
    );
}

function ArrayRenderer(props: { name: string; label: string; value: unknown[] }): JSX.Element {
    return (
        <div className="sap-api-container">
            <Label name={props.name} label={props.label} />
            <div className="sap-api-value">
                <ul className="sap-api-list">
                    {props.value.map((item, i) => (
                        <li key={i}>{renderObjectValue(item)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function renderObjectValue(val: unknown): JSX.Element {
    if (val === null || val === undefined) return <span className="sap-api-placeholder">—</span>;
    if (typeof val === 'boolean') return <span>{val ? 'Yes' : 'No'}</span>;
    if (typeof val === 'number') return <span>{val}</span>;
    if (Array.isArray(val)) {
        return (
            <ul className="sap-api-list">
                {val.map((item, i) => (
                    <li key={i}>{renderObjectValue(item)}</li>
                ))}
            </ul>
        );
    }
    if (typeof val === 'object') {
        return (
            <dl className="sap-api-obj">
                {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
                    <div key={k} className="sap-api-obj-row">
                        <dt className="sap-api-obj-key">{k}:</dt>{' '}
                        <dd className="sap-api-obj-val">{renderObjectValue(v)}</dd>
                    </div>
                ))}
            </dl>
        );
    }
    // string — render as markdown only if it contains markdown syntax
    const str = String(val);
    const hasMarkdown = /[*_`[\]#]/.test(str);
    return hasMarkdown ? <Markdown>{str}</Markdown> : <span>{str}</span>;
}

function ObjectRenderer(props: { name: string; label: string; value: object }): JSX.Element {
    return (
        <div className="sap-api-container">
            <Label name={props.name} label={props.label} />
            <div className="sap-api-value">{renderObjectValue(props.value)}</div>
        </div>
    );
}

function LinkRenderer(props: {
    name: string;
    label: string;
    value: unknown;
    callback: (v: unknown) => string | undefined;
}): JSX.Element {
    const href = props.callback(props.value);
    return (
        <div className="sap-api-container">
            <Label name={props.name} label={props.label} />
            <p className="sap-api-value">
                {href ? (
                    <a href={href} rel="noreferrer noopener" target="_blank" className="sap-api-link">
                        {String(props.value)}
                    </a>
                ) : (
                    String(props.value)
                )}
            </p>
        </div>
    );
}

export function buildGenericRenderer(
    fieldName: string,
    def: AttributeDefinition | undefined,
    config: OpenApiCustomAttributesConfig,
): (data: unknown) => JSX.Element | null {
    if (def && 'component' in def) {
        return def.component as (data: unknown) => JSX.Element | null;
    }

    return (data: unknown): JSX.Element | null => {
        const value = extractValue(data, fieldName);
        if (value === undefined || value === null) return null;

        const label = def && 'label' in def && def.label ? def.label : autoLabel(fieldName, config.prefixStartsWith);

        if (def?.type === 'link' && 'callback' in def) {
            return <LinkRenderer name={fieldName} label={label} value={value} callback={def.callback} />;
        }

        if (def?.type === 'boolean' || typeof value === 'boolean') {
            return <BooleanRenderer name={fieldName} label={label} value={Boolean(value)} />;
        }

        if (def?.type === 'number' || typeof value === 'number') {
            return <NumberRenderer name={fieldName} label={label} value={value as number} />;
        }

        if (def?.type === 'array' || Array.isArray(value)) {
            if (!Array.isArray(value)) return null;
            return <ArrayRenderer name={fieldName} label={label} value={value} />;
        }

        if (def?.type === 'object' || typeof value === 'object') {
            return <ObjectRenderer name={fieldName} label={label} value={value as object} />;
        }

        // string (default)
        const valueLinks = def && 'valueLinks' in def ? def.valueLinks : undefined;
        return <StringRenderer name={fieldName} label={label} value={String(value)} valueLinks={valueLinks} />;
    };
}
