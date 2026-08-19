import OpenApi from './icons/openapi-avatar-logo.svg';
import CsnLight from './icons/csn-interop-logo.svg';
import CsnDark from './icons/csn-interop-logo-dark.svg';
import AsyncApi from './icons/asyncapi-logo.svg';
import A2ALogo from './icons/a2a-logo.svg';
import McpLogo from './icons/mcp-logo.svg';
import { JSX } from 'react';
import styles from './editorComponent.module.css';

const csnExample = `{
  "$schema": "https://sap.github.io/csn-interop-specification/spec-v1/csn-interop-effective.schema.json#",
  "csnInteropEffective": "1.0",
  "$version": "2.0",
  "definitions": {
    "Airline": {
      "kind": "entity",
      "@EndUserText.label": "Airline",
      "@ObjectModel.modelingPattern": {
        "#": "ANALYTICAL_DIMENSION"
      },
      "@ODM.entityName": "Airline",
      "@API.entity.releaseState": "ACTIVE",
      "@PersonalData.entitySemantics": { "#": "DATA_SUBJECT_DETAILS" },
      "elements": {
        "AirlineID": {
          "@EndUserText.label": "Airline",
          "@ObjectModel.text.element": [
            "Name"
          ],
          "@PersonalData.fieldSemantics": { "#": "DATA_SUBJECT_ID" },
          "key": true,
          "type": "cds.String",
          "length": 3
        },
        "Name": {
          "@EndUserText.label": "Name",
          "@Semantics.text": true,
          "@PersonalData.isPotentiallyPersonal": true,
          "type": "cds.String",
          "length": 40
        },
        "CurrencyCode_code": {
          "@EndUserText.label": "Currency Code",
          "@Semantics.currencyCode": true,
          "type": "cds.String",
          "length": 3
        },
        "AirlinePicURL": {
          "type": "cds.String"
        }
      }
    },
    "Airport": {
      "kind": "entity",
      "@EndUserText.label": "Airport",
      "@ObjectModel.modelingPattern": {
        "#": "ANALYTICAL_DIMENSION"
      },
      "elements": {
        "AirportID": {
          "@EndUserText.label": "Airport",
          "@ObjectModel.text.element": [
            "Name"
          ],
          "key": true,
          "type": "cds.String",
          "length": 3
        },
        "Name": {
          "@EndUserText.label": "Name",
          "@Semantics.text": true,
          "type": "cds.String",
          "length": 40
        },
        "City": {
          "@EndUserText.label": "City",
          "type": "cds.String",
          "length": 40
        },
        "CountryCode_code": {
          "@EndUserText.label": "Country Code",
          "type": "cds.String",
          "length": 3,
          "@ObjectModel.foreignKey.association": {
            "=": "to_CountryCode"
          }
        },
        "to_CountryCode": {
          "type": "cds.Association",
          "target": "Countries",
          "cardinality": {
            "max": 1
          },
          "on": [
            {
              "ref": [
                "to_CountryCode",
                "code"
              ]
            },
            "=",
            {
              "ref": [
                "CountryCode_code"
              ]
            }
          ]
        }
      }
    },
    "Countries": {
      "kind": "entity",
      "@EndUserText.label": "Countries",
      "@ObjectModel.modelingPattern": {
        "#": "ANALYTICAL_DIMENSION"
      },
      "elements": {
        "code": {
          "@EndUserText.label": "Country Code",
          "@ObjectModel.text.association": {
            "=": "texts"
          },
          "key": true,
          "type": "cds.String",
          "length": 3
        },
        "texts": {
          "type": "cds.Composition",
          "cardinality": {
            "max": "*"
          },
          "target": "Countries_texts",
          "on": [
            {
              "ref": [
                "texts",
                "code"
              ]
            },
            "=",
            {
              "ref": [
                "code"
              ]
            }
          ]
        }
      }
    },
    "Countries_texts": {
      "kind": "entity",
      "@EndUserText.label": "Countries Texts",
      "@ObjectModel.modelingPattern": {
        "#": "LANGUAGE_DEPENDENT_TEXT"
      },
      "elements": {
        "code": {
          "@EndUserText.label": "Country Code",
          "key": true,
          "type": "cds.String",
          "length": 3
        },
        "locale": {
          "@EndUserText.label": "Language Code",
          "@Semantics.language": true,
          "key": true,
          "type": "cds.String",
          "length": 14
        },
        "name": {
          "@EndUserText.label": "Name",
          "@Semantics.text": true,
          "type": "cds.String",
          "length": 255
        },
        "descr": {
          "@EndUserText.label": "Description",
          "@Semantics.text": true,
          "type": "cds.String",
          "length": 1000
        }
      }
    },
    "FlightConnection": {
      "kind": "entity",
      "@EndUserText.label": "Flight Connection",
      "@ObjectModel.representativeKey": {
        "=": "ConnectionID"
      },
      "@ObjectModel.modelingPattern": {
        "#": "ANALYTICAL_DIMENSION"
      },
      "elements": {
        "AirlineID": {
          "@EndUserText.label": "Airline",
          "key": true,
          "type": "cds.String",
          "length": 3,
          "@ObjectModel.foreignKey.association": {
            "=": "to_Airline"
          }
        },
        "ConnectionID": {
          "@EndUserText.label": "Flight Number",
          "key": true,
          "type": "cds.String",
          "length": 4
        },
        "DepartureAirport_AirportID": {
          "@EndUserText.label": "Departure Airport",
          "type": "cds.String",
          "length": 3,
          "@ObjectModel.foreignKey.association": {
            "=": "to_DepartureAirport"
          }
        },
        "DestinationAirport_AirportID": {
          "@EndUserText.label": "Destination Airport",
          "type": "cds.String",
          "length": 3,
          "@ObjectModel.foreignKey.association": {
            "=": "to_DestinationAirport"
          }
        },
        "DepartureTime": {
          "@EndUserText.label": "Departure Time",
          "type": "cds.Time"
        },
        "ArrivalTime": {
          "@EndUserText.label": "Arrival Time",
          "type": "cds.Time"
        },
        "Distance": {
          "@EndUserText.label": "Distance",
          "@Semantics.quantity.unitOfMeasure": {
            "=": "DistanceUnit"
          },
          "type": "cds.Integer"
        },
        "DistanceUnit": {
          "@EndUserText.label": "Distance Unit",
          "type": "cds.String",
          "length": 3
        },
        "to_Airline": {
          "type": "cds.Association",
          "target": "Airline",
          "cardinality": {
            "max": "*"
          },
          "on": [
            {
              "ref": [
                "to_Airline",
                "AirlineID"
              ]
            },
            "=",
            {
              "ref": [
                "AirlineID"
              ]
            }
          ]
        },
        "to_DepartureAirport": {
          "type": "cds.Association",
          "target": "Airport",
          "cardinality": {
            "max": "*"
          },
          "on": [
            {
              "ref": [
                "to_DepartureAirport",
                "AirportID"
              ]
            },
            "=",
            {
              "ref": [
                "DepartureAirport_AirportID"
              ]
            }
          ]
        },
        "to_DestinationAirport": {
          "type": "cds.Association",
          "target": "Airport",
          "cardinality": {
            "max": "*"
          },
          "on": [
            {
              "ref": [
                "to_DestinationAirport",
                "AirportID"
              ]
            },
            "=",
            {
              "ref": [
                "DestinationAirport_AirportID"
              ]
            }
          ]
        }
      }
    },
    "Flight": {
      "kind": "entity",
      "@EndUserText.label": "Flight",
      "@ObjectModel.modelingPattern": {
        "#": "ANALYTICAL_FACT"
      },
      "@ObjectModel.supportedCapabilities": [
        {
          "#": "DATA_STRUCTURE"
        }
      ],
      "elements": {
        "AirlineID": {
          "@EndUserText.label": "Airline",
          "key": true,
          "type": "cds.String",
          "length": 3,
          "@ObjectModel.foreignKey.association": {
            "=": "to_Airline"
          }
        },
        "FlightDate": {
          "@EndUserText.label": "Flight Date",
          "key": true,
          "type": "cds.Date"
        },
        "ConnectionID": {
          "@EndUserText.label": "Flight Number",
          "key": true,
          "type": "cds.String",
          "length": 4,
          "@ObjectModel.foreignKey.association": {
            "=": "to_Connection"
          }
        },
        "Price": {
          "@EndUserText.label": "Price",
          "@Aggregation.default": {
            "#": "MIN"
          },
          "@Semantics.amount.currencyCode": {
            "=": "CurrencyCode_code"
          },
          "type": "cds.Decimal",
          "precision": 16,
          "scale": 3
        },
        "CurrencyCode_code": {
          "@EndUserText.label": "Currency Code",
          "@Semantics.currencyCode": true,
          "type": "cds.String",
          "length": 3
        },
        "PlaneType": {
          "@EndUserText.label": "Plane Type",
          "type": "cds.String",
          "length": 10
        },
        "MaximumSeats": {
          "@EndUserText.label": "Maximum Seats",
          "@Aggregation.default": {
            "#": "SUM"
          },
          "type": "cds.Integer"
        },
        "OccupiedSeats": {
          "@EndUserText.label": "Occupied Seats",
          "@Aggregation.default": {
            "#": "SUM"
          },
          "type": "cds.Integer"
        },
        "to_Airline": {
          "type": "cds.Association",
          "target": "Airline",
          "cardinality": {
            "max": "*"
          },
          "on": [
            {
              "ref": [
                "to_Airline",
                "AirlineID"
              ]
            },
            "=",
            {
              "ref": [
                "AirlineID"
              ]
            }
          ]
        },
        "to_Connection": {
          "type": "cds.Association",
          "target": "FlightConnection",
          "cardinality": {
            "max": "*"
          },
          "on": [
            {
              "ref": [
                "to_Connection",
                "AirlineID"
              ]
            },
            "=",
            {
              "ref": [
                "AirlineID"
              ]
            },
            "and",
            {
              "ref": [
                "to_Connection",
                "ConnectionID"
              ]
            },
            "=",
            {
              "ref": [
                "ConnectionID"
              ]
            }
          ]
        }
      }
    }
  }
}`;

const openApiExample = `openapi: 3.0.3
info:
  version: 1.0.0
  title: Petstore
  description: |
    To provide pet shop owners the ability to create and query information about their customers' pets, Petstore enables you to get a list of all pets, add new customers' pets, and search for information about a specific pet.
x-sap-shortText: Manages pet records for your pet shop management system.
x-sap-api-type: REST
x-sap-compliance-level: sap:core:v1
x-sap-direction: inbound
x-sap-ord-id: sap.petstore:apiResource:Petstore:v1
x-sap-stateInfo:
  state: ACTIVE
x-sap-extensible:
  supported: manual
  description: |
    Extensibility is supported via **custom fields**. Contact your system administrator
    to add custom properties to the Pet entity. See the [extensibility guide](https://help.sap.com) for details.
x-sap-ext-overview:
  - name: Communication Scenarios
    values:
      - text: Petstore Integration (SAP_COM_0001)
        format: plain
  - name: Additional Information
    values:
      - text: This API follows the **SAP API Style Guide**. All endpoints are versioned.
        format: markdown
externalDocs:
  description: "External documentation"
  url: "https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/17b6a171552544a6804f12ea83112a3f.html"
servers:
  - url: https://api.sap.com/petstore/v1
  - url: https://sandbox.api.sap.com/petstore
    description: Sandbox URL
paths:
  /pets:
    get:
      summary: Retrieve a list of all pets
      description: Provides a list of all the pets in the management system.
      operationId: listPets
      x-sap-operation-intent: read-collection
      tags:
        - Pets
      parameters:
        - name: limit
          in: query
          description: How many items to return at one time (max 100).
          required: false
          schema:
            type: integer
            format: int32
      responses:
        "200":
          description: Sucessfully provided a list of pets.
          headers:
            x-next:
              description: A link to the next page of responses.
              schema:
                type: string
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pets"
        default:
          description: Unable to provide a list of pets. Please try again.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
    post:
      summary: Add a pet
      description: Add a customer's pet to the management system.
      operationId: createPets
      x-sap-operation-intent: create
      tags:
        - Pets
      responses:
        "201":
          description: Null response
        "500":
          description: An unexpected error occurred. Please contact your IT representative for assistance.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /pets/{petId}:
    get:
      summary: Retrieve the unique ID for a pet
      description: Provides the identification number for a pet.
      operationId: showPetById
      x-sap-operation-intent: read-single
      x-sap-deprecated-operation:
        deprecationDate: "2024-06-01"
        successorOperationId: listPets
      tags:
        - Pets
      parameters:
        - name: petId
          in: path
          required: true
          description: Enter the ID of the pet.
          schema:
            type: string
      responses:
        "200":
          description: Successfully retrieved the ID of the pet.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pet"
        default:
          description: Unable to find the pet ID. Please try again.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
components:
  securitySchemes:
    BasicAuth:
      type: http
      scheme: basic
  schemas:
    Pet:
      type: object
      x-sap-odm-entity-name: Pet
      x-sap-odm-oid: petId
      x-sap-root-entity: true
      x-sap-dpp-entity-semantics: DataSubject
      x-sap-odm-semantic-key:
        - name: PrimaryKey
          values:
            - id
        - name: BusinessKey
          values:
            - name
            - tag
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
          x-sap-dpp-field-semantics: DataSubjectID
          x-sap-dpp-is-potentially-personal: true
        tag:
          type: string
        weight:
          type: number
          format: float
          x-sap-precision: 10
          x-sap-scale: 2
    Pets:
      type: array
      items:
        $ref: "#/components/schemas/Pet"
    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: integer
          format: int32
        message:
          type: string`;

const a2aExample = JSON.stringify(
    {
        name: 'Echo Agent',
        description: 'Echoes whatever you send it. Useful for testing the A2A renderer.',
        version: '1.0.0',
        url: 'https://example.com/agents/echo',
        capabilities: {
            streaming: true,
            pushNotifications: false,
            stateTransitionHistory: false,
        },
        defaultInputModes: ['text/plain'],
        defaultOutputModes: ['text/plain'],
        skills: [
            {
                id: 'echo',
                name: 'echo',
                description: 'Returns the input message verbatim.',
                tags: ['demo', 'echo'],
                examples: ['hello', 'world'],
            },
        ],
    },
    null,
    2,
);

export const asyncApiExample = `{
  "asyncapi": "2.0.0",
  "x-sap-catalog-spec-version": "1.2",
  "x-sap-application-namespace": "sap.grc",
  "info": {
    "title": "Compliance Issue Source Object Commands and Events",
    "description": "A compliance issue source object is the source for a compliance issue in the area of Governance, Risk, and Compliance. It consists of metadata that describe the structure of the business data handled by the source object.",
    "version": "1.1.0"
  },
  "x-sap-shortText": "Commands and events related to a compliance issue source object.",
  "x-sap-api-deprecated": false,
  "defaultContentType": "application/json",
  "channels": {
    "sap.grc.irm.ComplianceIssueSourceObject.Create.v1": {
      "publish": {
        "message": {
          "$ref": "#/components/messages/sap.grc.irm.ComplianceIssueSourceObject.Create.v1"
        }
      }
    },
    "sap.grc.irm.ComplianceIssueSourceObject.CreateAcknowledged.v1": {
      "subscribe": {
        "message": {
          "$ref": "#/components/messages/sap.grc.irm.ComplianceIssueSourceObject.CreateAcknowledged.v1"
        }
      }
    }
  },
  "components": {
    "messages": {
      "sap.grc.irm.ComplianceIssueSourceObject.Create.v1": {
        "name": "sap.grc.irm.ComplianceIssueSourceObject.Create.v1",
        "description": "Command message to create a compliance issue source object.",
        "headers": {
          "properties": {
            "specversion": {
              "const": "1.0"
            },
            "type": {
              "const": "sap.grc.irm.ComplianceIssueSourceObject.Create.v1"
            }
          }
        },
        "traits": [
          {
            "$ref": "#/components/messageTraits/CloudEventsHeader"
          }
        ],
        "payload": {
          "$ref": "#/components/schemas/ComplianceIssueSourceObjectCreateV1"
        }
      },
      "sap.grc.irm.ComplianceIssueSourceObject.CreateAcknowledged.v1": {
        "name": "sap.grc.irm.ComplianceIssueSourceObject.CreateAcknowledged.v1",
        "description": "Acknowledgment event for compliance issue source object create command message.",
        "headers": {
          "properties": {
            "specversion": {
              "const": "1.0"
            },
            "type": {
              "const": "sap.grc.irm.ComplianceIssueSourceObject.CreateAcknowledged.v1"
            }
          }
        },
        "traits": [
          {
            "$ref": "#/components/messageTraits/CloudEventsHeader"
          }
        ],
        "payload": {
          "$ref": "#/components/schemas/ComplianceIssueSourceObjectCreateAcknowledgedV1"
        }
      }
    },
    "schemas": {
      "MessageHeader": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "specversion",
          "type",
          "source",
          "id",
          "xsapcorrelationid"
        ],
        "properties": {
          "specversion": {
            "type": "string",
            "default": "1.0",
            "description": "The version of the CloudEvents specification which the message uses. This enables the interpretation of the context."
          },
          "source": {
            "type": "string",
            "description": "Identifies the instance the message originated in.",
            "example": "/default/sap.grc.irm"
          },
          "type": {
            "type": "string",
            "minLength": 1,
            "description": "Describes the type of the message related to the source the event originated in.",
            "example": "sap.grc.irm.ComplianceIssueSourceObject.Create.v1"
          },
          "subject": {
            "type": "string",
            "description": "Describes the subject of the event in the context of the source the event originated in (e.g. a certain business object).",
            "example": "ComplianceIssueSourceObject:4a463ab4-c719-49b9-8776-df50556d6e7d"
          },
          "id": {
            "type": "string",
            "minLength": 1,
            "description": "Identifies the message.",
            "example": "26bea6dd-5849-478a-bc74-4711a2baa8c7"
          },
          "time": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp of when the occurrence happened (timestamp per RFC 3339 String encoding).",
            "example": "2022-04-05T14:21:08Z"
          },
          "xsapcorrelationid": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. Unique identifier to identify objects in a transaction flow.",
            "example": "8f451a36-dd7f-470d-ba8e-70d81935e5cc"
          },
          "datacontenttype": {
            "type": "string",
            "default": "application/json",
            "description": "Content type of the payload data."
          }
        }
      },
      "ComplianceIssueSourceObjectCreateV1": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "type",
          "displayId"
        ],
        "properties": {
          "automatedProcedureId": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of a compliance automated procedure. In one payload, only one of the following properties can exist: \\"automatedProcedureId\\", \\"manualProcedureId\\", or \\"objectId\\".\\n",
            "example": "2be135c6-9bbd-11ec-b909-0242ac120002"
          },
          "manualProcedureId": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of a compliance manual procedure. In one payload, only one of the following properties can exist: \\"automatedProcedureId\\", \\"manualProcedureId\\", or \\"objectId\\".\\n",
            "example": "2be13940-9bbd-11ec-b909-0242ac120002"
          },
          "objectId": {
            "type": "string",
            "maxLength": 70,
            "description": "ID of an arbitrary source object. In one payload, only one of the following properties can exist: \\"automatedProcedureId\\", \\"manualProcedureId\\", or \\"objectId\\".\\n",
            "example": "2be13940-9bbd-11ec-b909-0242ac120002"
          },
          "type": {
            "type": "string",
            "maxLength": 48,
            "minLength": 1,
            "description": "Code of the related business object.",
            "example": "sap.grc.ap.ProcedureRun"
          },
          "displayId": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1,
            "description": "Human readable ID of the source object.",
            "example": "234550"
          },
          "name": {
            "type": "string",
            "maxLength": 100,
            "description": "Name of the source object.",
            "example": "Automated Procedure 234550"
          },
          "version": {
            "type": "string",
            "maxLength": 100,
            "nullable": true,
            "description": "Version number of the source object.",
            "example": "v1.2.0"
          },
          "namespace": {
            "type": "string",
            "maxLength": 100,
            "nullable": true,
            "description": "Namespace of the source object.",
            "example": "36bed228-fdbf-11ec-b939-0242ac120002"
          },
          "navigationTarget": {
            "$ref": "#/components/schemas/NavigationTarget"
          },
          "metadata": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/MetadataCreate"
            }
          },
          "relatedObjects": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/RelatedObjectCreate"
            }
          }
        }
      },
      "ComplianceIssueSourceObjectCreateAcknowledgedV1": {
        "type": "object",
        "description": "Acknowledgment message related to a ComplianceIssueSourceObjectCreate command message.",
        "additionalProperties": false,
        "required": [
          "acknowledgement"
        ],
        "properties": {
          "id": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of the created compliance issue source object."
          },
          "objectId": {
            "type": "string",
            "maxLength": 70,
            "description": "ID of an arbitrary source object.",
            "example": "2be13940-9bbd-11ec-b909-0242ac120002"
          },
          "automatedProcedureId": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of a compliance automated procedure.",
            "example": "2be135c6-9bbd-11ec-b909-0242ac120002"
          },
          "manualProcedureId": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of a compliance manual procedure.",
            "example": "2be13940-9bbd-11ec-b909-0242ac120002"
          },
          "acknowledgment": {
            "$ref": "#/components/schemas/Acknowledgment"
          }
        }
      },
      "MetadataCreate": {
        "additionalProperties": false,
        "type": "object",
        "description": "Metadata of the compliance issue source object.",
        "required": [
          "fieldName",
          "type"
        ],
        "properties": {
          "fieldName": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1,
            "description": "Name of the field.",
            "example": "CompanyCode"
          },
          "type": {
            "type": "string",
            "description": "Type of the field.",
            "enum": [
              "UUID",
              "STRING",
              "LARGE_STRING",
              "INTEGER",
              "DECIMAL",
              "DOUBLE",
              "BOOLEAN",
              "DATE",
              "TIME",
              "TIMESTAMP"
            ]
          },
          "length": {
            "type": "integer",
            "description": "Length of the field.",
            "example": 50
          },
          "scale": {
            "type": "integer",
            "description": "Scale of the field.",
            "example": 10
          },
          "precision": {
            "type": "integer",
            "description": "Precision of the field.",
            "example": 2
          },
          "isPersonalData": {
            "type": "boolean",
            "description": "Indicator to show if field contains personal data.",
            "example": true,
            "default": false
          },
          "isDataSubjectId": {
            "type": "boolean",
            "description": "Indicator to show if field contains a data subject ID.",
            "example": true,
            "default": false
          },
          "referenceField": {
            "type": "string",
            "description": "Name of the reference field.",
            "example": "CurrencyCode"
          },
          "referenceFieldType": {
            "type": "string",
            "description": "Type of the reference field.",
            "enum": [
              "QUANTITY",
              "CURRENCY",
              "DESCRIPTION"
            ]
          },
          "semanticDefinition": {
            "type": "string",
            "description": "Semantic definition of a metadata field.",
            "example": "CompanyCode"
          },
          "labels": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/MetadataLabelCreate"
            }
          }
        }
      },
      "RelatedObjectCreate": {
        "additionalProperties": false,
        "type": "object",
        "required": [
          "type",
          "displayId"
        ],
        "properties": {
          "controlId": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of a compliance control. In one payload and for each related object, only one of the following properties can exist: \\"controlId\\", \\"controlVersionId\\", \\"workpackageRunId\\",  \\"workPackageRunProcedureRunId\\", or \\"objectId\\".\\n",
            "example": "2be135c6-9bbd-11ec-b909-0242ac120002"
          },
          "controlVersionId": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of a compliance control. In one payload and for each related object, only one of the following properties can exist: \\"controlId\\", \\"controlVersionId\\", \\"workpackageRunId\\",  \\"workPackageRunProcedureRunId\\", or \\"objectId\\".\\n",
            "example": "2be135c6-9bbd-11ec-b909-0242ac120002"
          },
          "workpackageRunId": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of a compliance work package run. In one payload and for each related object, only one of the following properties can exist: \\"controlId\\", \\"controlVersionId\\", \\"workpackageRunId\\", \\"workPackageRunProcedureRunId\\", or \\"objectId\\".\\n",
            "example": "2be13940-9bbd-11ec-b909-0242ac120002"
          },
          "workPackageRunProcedureRunId": {
            "type": "string",
            "maxLength": 36,
            "description": "UUID. ID of a compliance work package run procedure run. In one payload and for each related object, only one of the following properties can exist: \\"controlId\\", \\"controlVersionId\\", \\"workpackageRunId\\",  \\"workPackageRunProcedureRunId\\", or \\"objectId\\".\\n",
            "example": "2be13940-9bbd-11ec-b909-0242ac120002"
          },
          "objectId": {
            "type": "string",
            "maxLength": 70,
            "description": "ID of an arbitrary object. In one payload and for each related object, only one of the following properties can exist: \\"controlId\\",  \\"controlVersionId\\",\\"workpackageRunId\\", \\"workPackageRunProcedureRunId\\", or \\"objectId\\".\\n",
            "example": "2be13940-9bbd-11ec-b909-0242ac120002"
          },
          "type": {
            "type": "string",
            "maxLength": 48,
            "minLength": 1,
            "description": "Code of the related business object.",
            "example": "sap.grc.ctrl.Control"
          },
          "name": {
            "type": "string",
            "maxLength": 100,
            "description": "Name of the related object.",
            "example": "Control 12358"
          },
          "displayId": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1,
            "description": "Human readable ID of the related object.",
            "example": "12358"
          },
          "navigationTarget": {
            "$ref": "#/components/schemas/NavigationTarget"
          }
        }
      },
      "NavigationTarget": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "url": {
            "type": "string",
            "description": "Absolute URL of a navigation target.",
            "example": "http://www.domainxyz.com?key=12356"
          },
          "intentBasedNavigation": {
            "$ref": "#/components/schemas/IntentBasedNavigation"
          }
        }
      },
      "IntentBasedNavigation": {
        "type": "object",
        "additionalProperties": false,
        "description": "Navigation target for UI navigation.",
        "required": [
          "semanticObject",
          "action",
          "parameters"
        ],
        "properties": {
          "semanticObject": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1,
            "description": "Semantic object used for UI navigation.",
            "example": "AutomatedProcedureRun"
          },
          "action": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1,
            "description": "Action used for UI navigation.",
            "example": "display"
          },
          "parameters": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/NavigationParameter"
            }
          }
        }
      },
      "NavigationParameter": {
        "type": "object",
        "additionalProperties": false,
        "description": "Name and value of a navigation parameter.",
        "required": [
          "name",
          "value"
        ],
        "properties": {
          "name": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1,
            "description": "Name of navigation parameter.",
            "example": "procedureRunResult"
          },
          "value": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1,
            "description": "Value of a navigation parameter.",
            "example": "d19e6fb2-737b-4e4b-aca5-e137592636ds"
          }
        }
      },
      "MetadataLabelCreate": {
        "type": "object",
        "additionalProperties": false,
        "description": "Language-dependent label of a field.",
        "required": [
          "languageCode",
          "text"
        ],
        "properties": {
          "languageCode": {
            "type": "string",
            "maxLength": 3,
            "minLength": 1,
            "description": "ISO language code.",
            "example": "EN"
          },
          "text": {
            "type": "string",
            "maxLength": 100,
            "minLength": 1,
            "description": "Field label.",
            "example": "Company Code"
          }
        }
      },
      "Acknowledgment": {
        "type": "object",
        "additionalProperties": false,
        "description": "Acknowledgment for command messages.",
        "properties": {
          "messageStatus": {
            "$ref": "#/components/schemas/AcknowledgmentStatus"
          },
          "messageResponse": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AcknowledgmentResponse"
            }
          }
        }
      },
      "AcknowledgmentResponse": {
        "type": "object",
        "additionalProperties": false,
        "description": "Message response pattern.",
        "properties": {
          "responseCode": {
            "$ref": "#/components/schemas/AcknowledgmentResponseCode"
          },
          "severity": {
            "$ref": "#/components/schemas/AcknowledgmentSeverity"
          },
          "parameter": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AcknowledgmentParameter"
            }
          }
        }
      },
      "AcknowledgmentParameter": {
        "type": "string",
        "description": "Miscellaneous parameter that could be used to compose a message."
      },
      "AcknowledgmentResponseCode": {
        "type": "string",
        "enum": [
          "INVALID_SOURCE_OBJECT",
          "INVALID_RELATED_OBJECT",
          "SOURCE_OBJECT_ALREADY_EXISTS"
        ],
        "description": "The response code could be used to reference a message bundle ID."
      },
      "AcknowledgmentSeverity": {
        "type": "string",
        "enum": [
          "SUCCESS",
          "WARNING",
          "ERROR"
        ],
        "description": "The response severity gives you a quick overview of the type of response."
      },
      "AcknowledgmentStatus": {
        "type": "string",
        "enum": [
          "SUCCESS",
          "FAILURE"
        ],
        "description": "Acknowledgment of whether the message was successfully processed."
      }
    },
    "messageTraits": {
      "CloudEventsHeader": {
        "x-sap-event-spec-version": "2.0",
        "x-sap-event-source": "/default/sap.grc.irm",
        "x-sap-event-source-parameters": "",
        "headers": {
          "type": "object",
          "required": [
            "specversion",
            "type",
            "source",
            "id",
            "xsapcorrelationid"
          ],
          "properties": {
            "specversion": {
              "type": "string",
              "default": "1.0",
              "description": "The version of the CloudEvents specification which the message uses. This enables the interpretation of the context."
            },
            "source": {
              "type": "string",
              "description": "Identifies the instance the message originated in.",
              "example": "/default/sap.grc.irm"
            },
            "type": {
              "type": "string",
              "minLength": 1,
              "description": "Describes the type of the message related to the source the event originated in.",
              "example": "sap.grc.irm.ComplianceIssueSourceObject.Create.v1"
            },
            "subject": {
              "type": "string",
              "description": "Describes the subject of the event in the context of the source the event originated in (e.g. a certain business object).",
              "example": "ComplianceIssueSourceObject:4a463ab4-c719-49b9-8776-df50556d6e7d"
            },
            "id": {
              "type": "string",
              "minLength": 1,
              "description": "Identifies the message.",
              "example": "26bea6dd-5849-478a-bc74-4711a2baa8c7"
            },
            "time": {
              "type": "string",
              "format": "date-time",
              "description": "Timestamp of when the occurrence happened (timestamp per RFC 3339 String encoding).",
              "example": "2022-04-05T14:21:08Z"
            },
            "xsapcorrelationid": {
              "type": "string",
              "maxLength": 36,
              "description": "UUID. Unique identifier to identify objects in a transaction flow.",
              "example": "8f451a36-dd7f-470d-ba8e-70d81935e5cc"
            },
            "datacontenttype": {
              "type": "string",
              "default": "application/json",
              "description": "Content type of the payload data."
            }
          }
        }
      }
    }
  }
}`;

const mcpExample = JSON.stringify(
    {
        $schema: 'https://static.modelcontextprotocol.io/schemas/2025-06-18/server-card.json',
        name: 'demo-mcp-server',
        title: 'Demo MCP Server',
        version: '1.0.0',
        description: 'A minimal MCP server card used for the metadata-renderer demo.',
        supportedProtocolVersions: ['2025-06-18'],
        remotes: [
            {
                type: 'streamable-http',
                url: 'https://example.com/mcp',
            },
            {
                type: 'sse',
                url: 'https://example.com/mcp',
            },
        ],
        capabilities: {
            tools: { listChanged: true },
            resources: { listChanged: false, subscribe: false },
            prompts: { listChanged: false },
        },
        tools: [
            {
                name: 'get_weather',
                description: 'Get the current weather for a given location.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        location: { type: 'string', description: 'City name or zip code' },
                        units: { type: 'string', enum: ['celsius', 'fahrenheit'], description: 'Temperature unit' },
                    },
                    required: ['location'],
                },
            },
            {
                name: 'search_web',
                description: 'Search the web and return a list of relevant results.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Search query' },
                        limit: { type: 'number', description: 'Maximum number of results to return' },
                    },
                    required: ['query'],
                },
            },
        ],
        resources: [
            {
                uri: 'file:///docs/readme.md',
                name: 'README',
                description: 'Project readme and getting-started guide.',
                mimeType: 'text/markdown',
            },
            {
                uri: 'config://app/settings',
                name: 'App Settings',
                description: 'Current application configuration.',
                mimeType: 'application/json',
            },
        ],
        prompts: [
            {
                name: 'summarize',
                description: 'Summarize the provided text in a few sentences.',
                arguments: [
                    { name: 'text', description: 'Text to summarize', required: true },
                    { name: 'style', description: 'Summary style: brief, detailed, or bullet-points', required: false },
                ],
            },
            {
                name: 'translate',
                description: 'Translate text to a target language.',
                arguments: [
                    { name: 'text', description: 'Text to translate', required: true },
                    { name: 'target_language', description: 'Target language (e.g. French, Japanese)', required: true },
                ],
            },
        ],
    },
    null,
    2,
);

export type FileFormats = 'json' | 'yaml';

export const fileExamples: {
    name: string;
    extension: FileFormats;
    content: string;
    image: { dark: JSX.Element; light: JSX.Element };
}[] = [
    {
        name: 'CSN Interop',
        extension: 'json',
        content: csnExample,
        image: {
            dark: <CsnDark className={styles.img} />,
            light: <CsnLight className={styles.img} />,
        },
    },
    {
        name: 'OpenAPI',
        extension: 'yaml',
        content: openApiExample,
        image: {
            dark: <OpenApi className={styles.img} />,
            light: <OpenApi className={styles.img} />,
        },
    },
    {
        name: 'AsyncAPI',
        extension: 'json',
        content: asyncApiExample,
        image: {
            dark: <AsyncApi className={styles.img} />,
            light: <AsyncApi className={styles.img} />,
        },
    },
    {
        name: 'A2A',
        extension: 'json',
        content: a2aExample,
        image: {
            dark: <A2ALogo className={styles.img} />,
            light: <A2ALogo className={styles.img} />,
        },
    },
    {
        name: 'MCP',
        extension: 'json',
        content: mcpExample,
        image: {
            dark: <McpLogo className={styles.img} />,
            light: <McpLogo className={styles.img} />,
        },
    },
];
