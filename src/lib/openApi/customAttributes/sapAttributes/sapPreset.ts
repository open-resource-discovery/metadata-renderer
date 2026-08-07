import type { JSX } from "react";
import type {
  OpenApiCustomAttributesConfig,
  AttributeDefinition,
} from "../types";
import extOverview from "./root/extOverview";
import stateInfo from "./root/stateInfo";
//import extensible from './root/extensible';
import ordId from "./root/ordId";
import deprecatedOperation from "./operation/deprecatedOperation";
import odmEntityName from "./schema/odmEntityName";
import odmSemanticKey from "./schema/odmSemanticKey";

function component(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (props: any) => JSX.Element | null,
): AttributeDefinition {
  return { component: fn as (props: unknown) => JSX.Element | null };
}

export const sapOpenApiAttributesConfig: OpenApiCustomAttributesConfig = {
  prefixStartsWith: "x-sap-",
  documentationUrl: (name, { version }) =>
    `https://github.com/SAP/openapi-specification/tree/main/sap-schemas/v${version}#${name}`,
  extensions: {
    "x-sap-compliance-level": {
      type: "link",
      label: "SAP Compliance Level",
      callback: (v) => {
        const links: Record<string, string> = {
          "sap:base:v1":
            "https://github.com/open-resource-discovery/specification/blob/main/docs/spec-extensions/policy-levels/sap-base-v1.md",
          "sap:core:v1":
            "https://github.com/open-resource-discovery/specification/blob/main/docs/spec-extensions/policy-levels/sap-core-v1.md",
          "sap:core:v2":
            "https://github.com/open-resource-discovery/specification/blob/main/docs/spec-extensions/policy-levels/sap-core-v1.md",
        };
        return links[String(v)];
      },
    },
    "x-sap-shortText": { type: "string", label: "SAP Short Text" },
    "x-sap-software-min-version": {
      type: "string",
      label: "SAP Software Version",
    },
    "x-sap-api-type": { type: "string", label: "SAP API Type" },
    "x-sap-direction": { type: "string", label: "SAP Direction" },
    "x-sap-ord-id": component(ordId),
    "x-sap-operation-intent": { type: "string", label: "SAP Operation Intent" },
    "x-sap-odm-oid": { type: "string", label: "ODM OID" },
    "x-sap-odm-oid-reference-entity-name": {
      type: "string",
      label: "ODM OID Reference Entity Name",
    },
    "x-sap-precision": { type: "number", label: "SAP Precision" },
    "x-sap-scale": { type: "number", label: "SAP Scale" },
    "x-sap-root-entity": { type: "boolean", label: "SAP Root Entity" },
    "x-sap-dpp-entity-semantics": {
      type: "string",
      label: "SAP DPP: Entity Semantics",
    },
    "x-sap-dpp-data-subject-role": {
      type: "string",
      label: "SAP DPP: Data Subject Role",
    },
    "x-sap-dpp-data-subject-role-description": {
      type: "string",
      label: "SAP DPP: Data Subject Role Description",
    },
    "x-sap-dpp-field-semantics": {
      type: "string",
      label: "SAP DPP: Field Semantics",
    },
    "x-sap-dpp-is-potentially-personal": {
      type: "boolean",
      label: "SAP DPP: Potentially Personal",
    },
    "x-sap-dpp-is-potentially-sensitive": {
      type: "boolean",
      label: "SAP DPP: Potentially Sensitive",
    },
    "x-sap-ext-overview": component(extOverview),
    "x-sap-stateInfo": component(stateInfo),
    //'x-sap-extensible': component(extensible),
    "x-sap-extensible": { type: "object", label: "SAP Extensible" },
    "x-sap-deprecated-operation": component(deprecatedOperation),
    "x-sap-odm-entity-name": component(odmEntityName),
    "x-sap-odm-semantic-key": component(odmSemanticKey),
  },
};
