# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React component library that renders metadata documents in multiple formats: OpenAPI (via Scalar), CSN (via `@sap/csn-interop-renderer`), AsyncAPI, A2A agent cards, and MCP server cards. The core feature is auto-detecting the format from content and dispatching to the right renderer.

Depends on two published packages: `@open-resource-discovery/a2a-editor` and `@open-resource-discovery/mcp-server-card-ui`.

## Commands

```bash
# Development
npm run dev              # Vite demo app at localhost:5173
npm run website:start    # Docusaurus docs site at localhost:3000

# Building
npm run build            # TypeScript check + Vite lib build (dist/)
npm run build:demo       # Demo SPA (dist-demo/)
npm run website:build    # Docusaurus static site

# Testing
npm test                 # Vitest unit tests (run once)
npm run test:watch       # Vitest in watch mode
npm run typecheck        # TypeScript type-check only

# Code quality
npm run lint             # ESLint check
npm run prettier         # Prettier auto-fix
```

### Running a single test

```bash
npx vitest run src/lib/core/utils.test.ts
```

## Architecture

### Format detection and dispatch

`src/lib/core/index.tsx` exports `MetadataRenderer` — the main component. It calls `detectMetaType()` from `core/utils.ts` and dispatches to a format-specific renderer. Detection priority:

1. CSN — checks for `csnInteropEffective` string
2. OpenAPI — checks for `openapi` or `swagger` fields
3. AsyncAPI — checks for `asyncapi` field
4. MCP — checks for `supportedProtocolVersions` array (**must be before A2A**)
5. A2A — checks for `capabilities` object + `skills` array

AsyncAPI is lazy-loaded to keep it out of the main bundle (it pulls in Node builtins).

### Renderer implementations

Each renderer is in its own directory under `src/lib/`:

| Format   | Renderer             | External library                                                                 |
| -------- | -------------------- | -------------------------------------------------------------------------------- |
| OpenAPI  | `openApi/index.tsx`  | `@scalar/api-reference-react`                                                    |
| CSN      | `csn/index.tsx`      | `@sap/csn-interop-renderer` (inside ShadowRoot for CSS isolation)                |
| AsyncAPI | `asyncApi/index.tsx` | `@asyncapi/react-component`                                                      |
| A2A      | `a2a/index.tsx`      | `AgentCardView` from `@open-resource-discovery/a2a-editor/card-view`             |
| MCP      | `mcp/index.tsx`      | `MCPServerCardView` from `@open-resource-discovery/mcp-server-card-ui/card-view` |

### Entry points

The lib build produces separate entry points for tree-shaking: `index`, `openapi`, `csn`, `asyncapi`, `a2a`, `mcp`, `styles`. The `styles` entry is a side-effect-only file that aggregates CSS from all renderers into a single `dist/index.css`.

### CSS isolation

The ORD card libraries (a2a-editor, mcp-server-card-ui) are Tailwind v4, which wraps its preflight reset in a cascade layer (`@layer base { *, ::before, ::after { margin: 0; box-sizing: border-box; … } }`). That layered reset **does** ship in `dist/index.css`, but because styles inside any `@layer` lose to unlayered styles regardless of specificity, the host page's own (unlayered) resets — e.g. Docusaurus/Infima — always win. So the preflight can't leak into the host page even though it's present.

This cascade-layer behavior is why the old `stripUnscopedPreflight` Vite plugin (which surgically removed the reset at build time, needed back when Tailwind v3 emitted *unlayered* preflight) is no longer necessary. It is left commented out in `vite.config.ts` and has no implementation in the repo.

CSN renders in **light DOM** — a `.csn-root` div with an inline `<style>`, isolated purely by the `.csn-root` class prefix on every rule. (A `ShadowRoot` wrapper exists at `src/lib/core/ShadowRoot.tsx` but is not currently used by CsnRenderer.)

### Styling

For how each renderer is themed — native library output vs. this project's custom components, the `--ord-*` token flow, per-renderer mechanisms, and environment gotchas — see [STYLING.md](STYLING.md).

### OpenAPI SAP attributes

`src/lib/openApi/sapAttributes/` contains plugin renderers for SAP-specific OpenAPI extensions (`x-sap-*`). These are injected into the Scalar renderer via the plugin system in `openApi/utils/plugins.ts`. Attributes are organized by scope: `root/`, `operation/`, `schema/`.

### Build externalization

The lib build externalizes **all** dependencies — including a2a-editor and mcp-server-card-ui. Consumers' bundlers resolve them. Only CSS is inlined.

## Path aliases

`@/` → `src/`, `@lib/` → `src/lib/`, `@demo/` → `src/demo/` (configured in `vite.config.ts` and `tsconfig.app.json`).
