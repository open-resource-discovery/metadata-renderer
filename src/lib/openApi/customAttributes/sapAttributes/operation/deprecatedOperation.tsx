import { JSX } from 'react';
import AttributeLink from '../../attributeLink';

type Props = {
    xSapDeprecatedOperation: {
        deprecationDate: string;
        successorOperationRef?: string;
        successorOperationId?: string;
    };
};

export default function deprecatedOperation({ xSapDeprecatedOperation }: Props): JSX.Element {
    const dateFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' });
    const deprecationDate = dateFormatter.format(new Date(xSapDeprecatedOperation.deprecationDate));

    return (
        <div className="sap-api-container">
            <div className="sap-api-label">
                SAP Deprecated Operation <AttributeLink attributeName="x-sap-deprecated-operation" />
            </div>
            <div className="sap-api-value">
                Deprecated on {deprecationDate} <br />
                {!xSapDeprecatedOperation.successorOperationRef &&
                !xSapDeprecatedOperation.successorOperationId ? null : (
                    <>
                        {' Successor '}
                        {xSapDeprecatedOperation.successorOperationRef ? (
                            <a href={xSapDeprecatedOperation.successorOperationRef} rel="noreferrer, noopener">
                                {xSapDeprecatedOperation.successorOperationRef}
                            </a>
                        ) : null}
                        {xSapDeprecatedOperation.successorOperationId ? (
                            <span>{xSapDeprecatedOperation.successorOperationId}</span>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
}
