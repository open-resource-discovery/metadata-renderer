import { JSX } from 'react';
import Markdown from 'react-markdown';
import AttributeLink from '../../attributeLink';

type Props = {
    xSapExtensible: {
        supported?: 'no' | 'manual' | 'automatic';
        type?: 'no' | 'manual' | 'automatic';
        description?: string;
    };
};

export default function extensible({ xSapExtensible }: Props): JSX.Element {
    const strategyMap: Record<string, string> = {
        no: 'Not supported',
        manual: 'Supported with manual steps',
        automatic: 'Supported with automatic steps',
    };
    const strategy = strategyMap[xSapExtensible.supported ?? xSapExtensible.type ?? ''] ?? '';
    return (
        <div className="sap-api-container">
            <div className="sap-api-label sap-api-label--root">
                SAP Extensible <AttributeLink attributeName="x-sap-extensible" />
            </div>
            <div className="sap-api-value sap-api-value--root">
                <strong>{strategy}</strong> <br />
                {xSapExtensible.description ? <Markdown>{xSapExtensible.description}</Markdown> : null}
            </div>
        </div>
    );
}
