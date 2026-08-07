import type { JSX, ComponentType } from 'react';
import Markdown from 'react-markdown';
import type { ExtensionComponentProps } from '@asyncapi/react-component';
import type { AsyncApiAttributeDefinition, AsyncApiCustomAttributesConfig } from './types';
import AttributeLink from './attributeLink';

function autoLabel(fieldName: string, prefix?: string): string {
    let name = fieldName;
    if (prefix && name.startsWith(prefix)) name = name.slice(prefix.length);
    return name
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .split('-')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function Label({ name, label }: { name: string; label: string }): JSX.Element {
    return (
        <div className="asyncapi-attr-label">
            {label} <AttributeLink attributeName={name} />
        </div>
    );
}

function renderObjectValue(val: unknown): JSX.Element {
    if (val === null || val === undefined) return <span className="asyncapi-attr-placeholder">—</span>;
    if (typeof val === 'boolean') return <span>{val ? 'Yes' : 'No'}</span>;
    if (typeof val === 'number') return <span>{val}</span>;
    if (Array.isArray(val)) {
        return (
            <ul className="asyncapi-attr-list">
                {val.map((item, i) => (
                    <li key={i}>{renderObjectValue(item)}</li>
                ))}
            </ul>
        );
    }
    if (typeof val === 'object') {
        return (
            <dl className="asyncapi-attr-obj">
                {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
                    <div key={k} className="asyncapi-attr-obj-row">
                        <dt className="asyncapi-attr-obj-key">{k}:</dt>{' '}
                        <dd className="asyncapi-attr-obj-val">{renderObjectValue(v)}</dd>
                    </div>
                ))}
            </dl>
        );
    }
    const str = String(val);
    const hasMarkdown = /[*_`[\]#]/.test(str);
    return hasMarkdown ? <Markdown>{str}</Markdown> : <span>{str}</span>;
}

function StringRenderer(props: {
    name: string;
    label: string;
    value: string;
    valueLinks?: Record<string, string>;
}): JSX.Element {
    const link = props.valueLinks?.[props.value];
    return (
        <div className="asyncapi-attr-row">
            <Label name={props.name} label={props.label} />
            <p className="asyncapi-attr-value">
                {link ? (
                    <a href={link} rel="noreferrer noopener" target="_blank" className="asyncapi-attr-link">
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
        <div className="asyncapi-attr-row">
            <Label name={props.name} label={props.label} />
            <p className="asyncapi-attr-value">{props.value ? 'Yes' : 'No'}</p>
        </div>
    );
}

function NumberRenderer(props: { name: string; label: string; value: number }): JSX.Element {
    return (
        <div className="asyncapi-attr-row">
            <Label name={props.name} label={props.label} />
            <p className="asyncapi-attr-value">{props.value}</p>
        </div>
    );
}

function ArrayRenderer(props: { name: string; label: string; value: unknown[] }): JSX.Element {
    return (
        <div className="asyncapi-attr-row">
            <Label name={props.name} label={props.label} />
            <div className="asyncapi-attr-value">
                <ul className="asyncapi-attr-list">
                    {props.value.map((item, i) => (
                        <li key={i}>{renderObjectValue(item)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function ObjectRenderer(props: { name: string; label: string; value: object }): JSX.Element {
    return (
        <div className="asyncapi-attr-row">
            <Label name={props.name} label={props.label} />
            <div className="asyncapi-attr-value">{renderObjectValue(props.value)}</div>
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
        <div className="asyncapi-attr-row">
            <Label name={props.name} label={props.label} />
            <p className="asyncapi-attr-value">
                {href ? (
                    <a href={href} rel="noreferrer noopener" target="_blank" className="asyncapi-attr-link">
                        {String(props.value)}
                    </a>
                ) : (
                    String(props.value)
                )}
            </p>
        </div>
    );
}

export function buildAsyncApiGenericRenderer(
    fieldName: string,
    def: AsyncApiAttributeDefinition | undefined,
    config: AsyncApiCustomAttributesConfig,
): ComponentType<ExtensionComponentProps> {
    if (def && 'component' in def) return def.component;

    return function AsyncApiFieldRenderer({ propertyValue }: ExtensionComponentProps): JSX.Element | null {
        const value = propertyValue;
        if (value === undefined || value === null) return null;

        const label = def && 'label' in def && def.label ? def.label : autoLabel(fieldName, config.prefixStartsWith);

        if (def?.type === 'link') {
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

        const valueLinks = def && 'valueLinks' in def ? def.valueLinks : undefined;
        return <StringRenderer name={fieldName} label={label} value={String(value)} valueLinks={valueLinks} />;
    };
}
