import { JSX } from 'react';
import AttributeLink from '../../attributeLink';

const background = {
    ACTIVE: 'color-mix(in srgb, var(--scalar-color-green) 15%, transparent)',
    BETA: 'color-mix(in srgb, var(--scalar-color-blue) 15%, transparent)',
    DEPRECATED: 'color-mix(in srgb, var(--scalar-color-orange) 15%, transparent)',
    DECOMMISSIONED: 'color-mix(in srgb, var(--scalar-color-red) 15%, transparent)',
};

const color = {
    ACTIVE: 'var(--scalar-color-green)',
    BETA: 'var(--scalar-color-blue)',
    DEPRECATED: 'var(--scalar-color-orange)',
    DECOMMISSIONED: 'var(--scalar-color-red)',
};

type Props = {
    xSapStateInfo: {
        state: string;
        deprecationDate?: string;
        decommissionedDate?: string;
        successorApi?: string;
    };
};

export default function StateInfo({ xSapStateInfo }: Props): JSX.Element | null {
    if (!xSapStateInfo) return null;
    const state = xSapStateInfo.state;
    const status = state?.toUpperCase() as 'ACTIVE' | 'BETA' | 'DEPRECATED' | 'DECOMMISSIONED';

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
        <div className="sap-api-container">
            <div className="sap-api-label">
                API State <AttributeLink attributeName="x-sap-stateInfo" />
            </div>
            <div className="sap-api-value">
                {badge}
                {xSapStateInfo.deprecationDate && <div>Deprecated on {formatDate(xSapStateInfo.deprecationDate)}</div>}
                {xSapStateInfo.decommissionedDate && (
                    <div>Decommissioned on {formatDate(xSapStateInfo.decommissionedDate)}</div>
                )}
                {xSapStateInfo.successorApi && (
                    <div>
                        {'Successor API: '}
                        <a href={xSapStateInfo.successorApi} target="_blank" rel="noreferrer" className="sap-api-link">
                            {xSapStateInfo.successorApi}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
