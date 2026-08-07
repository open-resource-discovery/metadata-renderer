---
slug: /
sidebar_position: 0
title: 'Overview'
---

## Motivation

Displaying metadata collected within SAP products in a consistent and user-friendly manner is crucial for enhancing user experience and ensuring seamless integration across various platforms. The `@open-resource-discovery/metadata-renderer` library addresses this need by providing a robust solution for rendering metadata files according to SAP specifications.

The library is a set of React components that render the supported metadata formats (OpenAPI, CSN interop, AsyncAPI, A2A, MCP) consistently across SAP applications.

`@open-resource-discovery/metadata-renderer` ships as ESM with subpath entry points for each protocol, so consumers can tree-shake to only the renderers they need.

## Project Status

The metadata renderer is released as BETA and ready for test purpose adoption.

## Relevant Links

- [CSN interop specification](https://sap.github.io/csn-interop-specification/)
- [SAP OpenAPI specification](https://github.com/SAP/openapi-specification/tree/main/sap-schemas/v3.0)
