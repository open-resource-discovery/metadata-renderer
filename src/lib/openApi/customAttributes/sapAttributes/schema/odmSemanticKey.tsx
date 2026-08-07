import { JSX } from 'react';
import AttributeLink from '../../attributeLink';

type SemanticKeyEntry = {
    name: string;
    values: string[];
};

type Props = {
    xSapOdmSemanticKey: SemanticKeyEntry[];
};

export default function odmSemanticKey({ xSapOdmSemanticKey }: Props): JSX.Element | null {
    return (
        <div className="sap-api-container">
            <div className="sap-api-label">
                ODM Semantic Key <AttributeLink attributeName="x-sap-odm-semantic-key" />
            </div>
            <div className="sap-api-value">
                {xSapOdmSemanticKey.map((entry) => (
                    <div key={entry.name}>
                        <strong>{entry.name}</strong>
                        <ul className="sap-api-list">
                            {entry.values.map((v) => (
                                <li key={v}>{v}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
