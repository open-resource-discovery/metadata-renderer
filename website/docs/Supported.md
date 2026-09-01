---
sidebar_position: 3
title: Supported Document Types
---

# Supported Document Types

`@open-resource-discovery/metadata-renderer` renders the following API metadata formats into a structured, navigable UI.

## OpenAPI

OpenAPI (formerly Swagger) is the most widely-used standard for describing RESTful HTTP APIs. The renderer delegates to [Scalar](https://scalar.com/) for a rich, interactive API reference experience, supporting OpenAPI 3.0, 3.1, and 2.0/Swagger documents in JSON or YAML.

- **Website:** [OpenAPI](https://www.openapis.org/)
- **Renderer:** [Scalar](https://scalar.com/)

## AsyncAPI

AsyncAPI describes event-driven and message-based APIs (Kafka, MQTT, WebSocket, etc.). Documents in AsyncAPI 2.x or 3.x format (JSON or YAML) are rendered via the official AsyncAPI React component.

- **Website:** [AsyncAPI](https://www.asyncapi.com/)
- **Renderer:** [AsyncAPI React Component](https://asyncapi.github.io/asyncapi-react/)

## A2A

A2A (Agent-to-Agent) is Google's open protocol for communication between AI agents. Agent card JSON documents are rendered to show agent capabilities, skills, and endpoints.

- **Website:** [A2A Protocol](https://a2a-protocol.org/)
- **Renderer:** [A2A Editor](https://open-resource-discovery.github.io/a2a-editor/)

## MCP

MCP (Model Context Protocol) is Anthropic's open standard for connecting AI models to external tools and data sources. MCP server card JSON documents are rendered to display available tools, resources, and prompts.

- **Website:** [Model Context Protocol](https://modelcontextprotocol.io/)
- **Renderer:** [MCP Server Card UI](https://open-resource-discovery.github.io/mcp-server-card-ui/)

## CSN Interop

CSN (Core Schema Notation) interop is SAP's format for describing data models and their annotations in a machine-readable way. The renderer presents entity types, properties, and annotations in a structured layout.

- **Specification:** [CSN Interop Specification](https://sap.github.io/csn-interop-specification/spec-v1/csn-interop-effective)
- **Renderer:** [CSN Interop Renderer](https://sap.github.io/csn-interop-renderer/)

## ORD Overlay

ORD Overlay is a patch format defined by the Open Resource Discovery specification. It allows teams to annotate and extend existing API metadata documents without modifying the originals. Overlay 0.1 documents (JSON or YAML) are rendered to show the set of patches and their targets.

- **Specification:** [ORD Overlay specification](https://open-resource-discovery.org/spec-v1/interfaces/OrdOverlay)
- **Renderer:** [ORD Overlay Editor](https://open-resource-discovery.github.io/overlay-editor)

---

## Environment Compatibility

The library is designed to be compatible with React 18+ applications and modern web browsers.

Please raise an [issue](https://github.com/open-resource-discovery/metadata-renderer/issues) if you encounter problems with specific UI libraries or framework integrations.
