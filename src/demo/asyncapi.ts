export const asyncApi = `{
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
