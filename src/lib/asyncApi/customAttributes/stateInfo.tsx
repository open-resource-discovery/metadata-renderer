import type { JSX } from 'react';
import type { ExtensionComponentProps } from '@asyncapi/react-component';
import AttributeLink from './attributeLink';

const background: Record<string, string> = {
    ACTIVE: 'color-mix(in srgb, #22c55e 15%, transparent)',
    BETA: 'color-mix(in srgb, #3b82f6 15%, transparent)',
    DEPRECATED: 'color-mix(in srgb, #f97316 15%, transparent)',
    DECOMMISSIONED: 'color-mix(in srgb, #ef4444 15%, transparent)',
};

const color: Record<string, string> = {
    ACTIVE: '#16a34a',
    BETA: '#2563eb',
    DEPRECATED: '#ea580c',
    DECOMMISSIONED: '#dc2626',
};

type StateInfoValue = {
    state: string;
    deprecationDate?: string;
    decommissionedDate?: string;
    link?: string;
};

export default function AsyncApiStateInfo({
    propertyName,
    propertyValue,
}: ExtensionComponentProps): JSX.Element | null {
    if (!propertyValue || typeof propertyValue !== 'object') return null;
    const info = propertyValue as StateInfoValue;
    const status = info.state?.toUpperCase();

    const badge = (
        <span
            style={{
                display: 'inline-block',
                borderRadius: '10px',
                padding: '0 6px',
                background: background[status] || '',
                color: color[status] || '',
            }}
        >
            {status}
        </span>
    );

    const dateFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' });
    const formatDate = (d: string) => {
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? d : dateFormatter.format(parsed);
    };

    return (
        <div className="asyncapi-attr-row">
            <div className="asyncapi-attr-label">
                API State <AttributeLink attributeName={propertyName} />
            </div>
            <div className="asyncapi-attr-value">
                {badge}
                {info.deprecationDate && <div>Deprecated on {formatDate(info.deprecationDate)}</div>}
                {info.decommissionedDate && <div>Decommissioned on {formatDate(info.decommissionedDate)}</div>}
                {info.link && (
                    <div>
                        {'More info: '}
                        <a href={info.link} target="_blank" rel="noreferrer" className="asyncapi-attr-link">
                            {info.link}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
