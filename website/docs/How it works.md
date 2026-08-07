---
sidebar_position: 5
title: How it works
---

This is a React component library that renders metadata documents. The top-level `MetadataRenderer` sniffs the input string and dispatches to a protocol-specific renderer that is preconfigured to render SAP Attributes specified in each format.

Underneath, each protocol delegates to a specialized library:

- **CSN** — [@sap/csn-interop-renderer](https://sap.github.io/csn-interop-renderer)
- **OpenAPI** — [@scalar/api-reference-react](https://scalar.com/)
- **AsyncAPI** — [@asyncapi/react-component](https://github.com/asyncapi/asyncapi-react)
- **A2A** — [@open-resource-discovery/a2a-editor](https://www.npmjs.com/package/@open-resource-discovery/a2a-editor)
- **MCP** — [@open-resource-discovery/mcp-server-card-ui](https://www.npmjs.com/package/@open-resource-discovery/mcp-server-card-ui)

Use the protocol-specific subpath imports (`@sap/metadata-renderer/openapi`, `/csn`, `/asyncapi`, `/a2a`, `/mcp`) when you only need one renderer — the rest stays out of your bundle.
