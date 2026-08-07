import type { AsyncApiCustomAttributesConfig } from './types';
import AsyncApiStateInfo from './stateInfo';

export const sapAsyncApiAttributesConfig: AsyncApiCustomAttributesConfig = {
    prefixStartsWith: 'x-sap-',
    documentationUrl: (name) => `https://github.com/SAP/asyncapi-specification#${name}`,
    extensions: {
        // Root-level (AsyncAPI object / Info)
        'x-sap-catalog-spec-version': { type: 'string', label: 'SAP Catalog Spec Version' },
        'x-sap-application-namespace': { type: 'string', label: 'SAP Application Namespace' },
        'x-sap-ord-id': { type: 'string', label: 'ORD ID' },
        'x-sap-shortText': { type: 'string', label: 'SAP Short Text' },
        'x-sap-software-min-version': { type: 'string', label: 'SAP Software Version' },
        // Root + message-level
        // Note: the AsyncAPI spec allows only Beta/Active/Deprecated (case-insensitive) for `state`.
        // DECOMMISSIONED is not in the spec but the renderer handles it defensively
        // because decommissionedDate is a valid field in the schema.
        'x-sap-stateInfo': { component: AsyncApiStateInfo },
        // Message-level
        'x-sap-event-spec-version': { type: 'string', label: 'SAP Event Spec Version' },
        'x-sap-event-source': { type: 'string', label: 'SAP Event Source' },
        'x-sap-event-source-parameters': { type: 'object', label: 'SAP Event Source Parameters' },
        'x-sap-event-version': { type: 'string', label: 'SAP Event Version' },
        'x-sap-event-characteristics': { type: 'object', label: 'SAP Event Characteristics' },
        'x-sap-object-type': { type: 'string', label: 'SAP Object Type' },
        'x-sap-odm-version': { type: 'string', label: 'SAP ODM Version' },
        'x-sap-logical-odm-event-version': { type: 'string', label: 'SAP Logical ODM Event Version' },
        // DPP fields
        'x-sap-dpp-entity-semantics': { type: 'string', label: 'SAP DPP: Entity Semantics' },
        'x-sap-dpp-data-subject-role': { type: 'string', label: 'SAP DPP: Data Subject Role' },
        'x-sap-dpp-data-subject-role-description': { type: 'string', label: 'SAP DPP: Data Subject Role Description' },
        'x-sap-dpp-field-semantics': { type: 'string', label: 'SAP DPP: Field Semantics' },
        'x-sap-dpp-is-potentially-personal': { type: 'boolean', label: 'SAP DPP: Potentially Personal' },
        'x-sap-dpp-is-potentially-sensitive': { type: 'boolean', label: 'SAP DPP: Potentially Sensitive' },
    },
};
