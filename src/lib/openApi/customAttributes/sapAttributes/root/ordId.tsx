import { JSX, useState } from 'react';
import AttributeLink from '../../attributeLink';

type Props = {
    xSapOrdId: string;
};

function CopyIcon(): JSX.Element {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function CheckIcon(): JSX.Element {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

export default function ordId({ xSapOrdId }: Props): JSX.Element | null {
    const [copied, setCopied] = useState(false);

    if (!xSapOrdId) return null;

    const copy = () => {
        void navigator.clipboard?.writeText(xSapOrdId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <div className="sap-api-container">
            <div className="sap-api-label">
                ORD ID <AttributeLink attributeName="x-sap-ord-id" />
            </div>
            <div className="sap-api-value sap-api-ord-id">
                <span className="sap-api-ord-id-text">{xSapOrdId}</span>
                <button
                    type="button"
                    className="sap-api-copy-btn"
                    onClick={copy}
                    aria-label="Copy ORD ID"
                    title={copied ? 'Copied' : 'Copy'}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
        </div>
    );
}
