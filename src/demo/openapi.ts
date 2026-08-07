export const openApi = `{
  "swagger": "2.0",
    "x-sap-stateInfo": {
    "state": "Deprecated",
    "deprecationDate": "2022-01-01",
    "successorApi": "url.com"
  },
  "info": {
    "version": "1.0",
    "title": "API Portal - Content Archive Transport (CF)",
    "description": "The Content Archive Transport API allows you to export API proxies along with their dependencies from the source and import the same to the target system. During export a zip bundle gets generated, you can use this zip bundle to import the API Proxies in the target system.",
    "x-targetEndpoint": "https://us10trialapiportal.cfapps.us10.hana.ondemand.com/apiportal/api/1.0/"
  },
  "securityDefinitions": {
    "OAuth2_ClientCredentials": {
      "type": "oauth2",
      "flow": "application",
      "tokenUrl": "https://{tokenUrl}/oauth/token?grant_type=client_credentials",
      "scopes": {
        
      }
    }
  },
  "security": [
    {
      "OAuth2_ClientCredentials": [
        
      ]
    }
  ],
  "externalDocs": {
    "description": "Business Documentation",
    "url": "https://help.sap.com/docs/SAP_CLOUD_PLATFORM_API_MANAGEMENT/66d066d903c2473f81ec33acfe2ccdb4/901fbde8415f42d49c2a12f4b42ab856.html"
  },
  "host": "sandbox.api.sap.com",
  "x-sap-shortText": "Export and import multiple API Proxies and their dependencies using the zip bundle.",
  "basePath": "/sapapimanagement/apiportal",
  "x-servers": [
    {
      "url": "https://eu20apiportal.cfapps.eu20.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal EU20 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal EU20 tokenUrl"
        }
      }
    },
    {
      "url": "https://us20apiportal.cfapps.us20.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal US20 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal US20 tokenUrl"
        }
      }
    },
    {
      "url": "https://jp20apiportal.cfapps.jp20.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal jp20 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal jp20 tokenUrl"
        }
      }
    },
    {
      "url": "https://ap21apiportal.cfapps.ap21.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal ap21 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal ap21 tokenUrl"
        }
      }
    },
    {
      "url": "https://us21apiportal.cfapps.us21.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal us21 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal us21 tokenUrl"
        }
      }
    },
    {
      "url": "https://ap10apiportal.cfapps.ap10.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal ap10 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal ap10 tokenUrl"
        }
      }
    },
    {
      "url": "https://br10apiportal.cfapps.br10.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal br10 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal br10 tokenUrl"
        }
      }
    },
    {
      "url": "https://jp10apiportal.cfapps.jp10.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal jp10 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal jp10 tokenUrl"
        }
      }
    },
    {
      "url": "https://eu10apiportal.cfapps.eu10.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal eu10 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal eu10 tokenUrl"
        }
      }
    },
    {
      "url": "https://us10apiportal.cfapps.us10.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal us10 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal us10 tokenUrl"
        }
      }
    },
    {
      "url": "https://ca10apiportal.cfapps.ca10.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal ca10 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal ca10 tokenUrl"
        }
      }
    },
    {
      "url": "https://ap11apiportal.cfapps.ap11.hana.ondemand.com/apiportal/api/1.0",
      "description": "API Portal ap11 API endpoint",
      "templates": {
        "tokenUrl": {
          "description": "SAP API Management API Portal ap11 tokenUrl"
        }
      }
    }
  ],
  "tags": [
    {
      "name": "Content Archive Transport"
    }
  ],
  "schemes": [
    "https"
  ],
  "paths": {
    "/ContentArchive.svc": {
      "get": {
        "tags": [
          "Content Archive Transport"
        ],
        "summary": "API Proxies from the API Portal as a zip bundle",
        "description": "Returns the zip bundle that contains multiple API Proxies and their dependencies. You can use this zip bundle to import the API Proxies to another API Portal using the POST call.",
        "produces": [
          "application/zip"
        ],
        "parameters": [
          {
            "name": "payload",
            "in": "body",
            "description": "List of the API Proxies to be exported as a zip bundle. Provide the names of the API Proxies you want to export in the entities array present in the payload.",
            "required": true,
            "schema": {
              "$ref": "#/definitions/payload"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/appAllSuccess"
            }
          },
          "400": {
            "description": "Bad Request - Invalid Payload",
            "schema": {
              "$ref": "#/definitions/exportingerror"
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "$ref": "#/definitions/exportingerror"
            }
          },
          "default": {
            "description": "Unexpected error",
            "schema": {
              "$ref": "#/definitions/Error"
            }
          }
        }
      },
      "post": {
        "tags": [
          "Content Archive Transport"
        ],
        "summary": "API Proxies from the zip bundle",
        "description": "Description: Creates multiple API Proxies along with their dependencies from the zip bundle.  Send the POST request with multipart/form-data as the content type and add the following property in the payload: name=\\"file\\" and filename=\\"file path\\"",
        "produces": [
          "application/json"
        ],
        "consumes": [
          "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "file",
            "in": "formData",
            "description": "The zip file that contains the API Proxies and their dependencies.",
            "required": true,
            "type": "file"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/postallSuccess"
            }
          },
          "400": {
            "description": "Bad Request - Missing required parameter or provided input not in the required format",
            "schema": {
              "$ref": "#/definitions/exportingerror"
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "$ref": "#/definitions/exportingerror"
            }
          },
          "default": {
            "description": "Unexpected error",
            "schema": {
              "$ref": "#/definitions/Error"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "payload": {
      "type": "object",
      "required": [
        "selection"
      ],
      "properties": {
        "selection": {
          "type": "object",
          "required": [
            "apiproxies"
          ],
          "properties": {
            "apiproxies": {
              "type": "object",
              "required": [
                "entities"
              ],
              "properties": {
                "entities": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [
                      "name"
                    ],
                    "properties": {
                      "name": {
                        "type": [
                          "string"
                        ],
                        "maxLength": 255
                      }
                    },
                    "example": {
                      "name": "NorthWind"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "appAllSuccess": {
      "type": "object",
      "x-sap-odm-semantic-key": [
        {
          "name": "ExportBundle",
          "values": ["filename", "version"]
        },
        {
          "name": "Source",
          "values": ["tenantId"]
        }
      ],
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string"
            }
          }
        }
      }
    },
    "postallSuccess": {
      "type": "string"
    },
    "Error": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        },
        "code": {
          "type": "integer",
          "format": "int32"
        },
        "fields": {
          "type": "string"
        }
      }
    },
    "exportingerror": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string",
          "description": "Error code"
        },
        "message": {
          "type": "object",
          "properties": {
            "lang": {
              "type": "string",
              "description": "Language code of the error mesage"
            },
            "value": {
              "type": "string",
              "description": "Detailed error message"
            }
          }
        }
      }
    }
  }
}`;
