import { JSX } from 'react';
import Markdown from 'react-markdown';
import AttributeLink from '../../attributeLink';
import { typeCheckExSapExtOverviewExSapExtOverview } from './typeCheckXxtOverview';

export default function extOverview(props: unknown): JSX.Element | null {
    if (!typeCheckExSapExtOverviewExSapExtOverview(props)) {
        return null;
    }

    const { xSapExtOverview } = props;

    return (
        <div className="sap-api-container">
            <div className="sap-api-label sap-api-label--root">
                SAP Extensibility Overview <AttributeLink attributeName="x-sap-ext-overview" />
            </div>
            <div className="sap-api-value sap-api-value--root">
                {xSapExtOverview.map((extension) => (
                    <div key={extension.name}>
                        <strong>{extension.name}</strong>
                        <ul className="sap-api-list">
                            {typeof extension.values === 'string' ? (
                                <li>{extension.values}</li>
                            ) : (
                                extension.values.map((value) =>
                                    typeof value === 'string' ? (
                                        <li key={value}>{value}</li>
                                    ) : (
                                        <li key={value.text}>
                                            {value.format === 'plain' ? value.text : <Markdown>{value.text}</Markdown>}
                                        </li>
                                    ),
                                )
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
