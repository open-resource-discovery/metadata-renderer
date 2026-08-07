import { JSX } from "react";
import AttributeLink from "../../attributeLink";

type Props = {
  xSapOdmEntityName: string;
};

export default function odmEntityName({
  xSapOdmEntityName,
}: Props): JSX.Element | null {
  return (
    <div className="sap-api-container">
      <div className="sap-api-label">
        ODM entity name <AttributeLink attributeName="x-sap-odm-entity-name" />
      </div>
      <div className="sap-api-value">{xSapOdmEntityName}</div>
    </div>
  );
}
