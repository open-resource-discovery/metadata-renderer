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

| Format   | Renderer             | External library                                                                                  |
| -------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| OpenAPI  | `openApi/index.tsx`  | `createApiReference` from `@scalar/api-reference` (CSS + types via `@scalar/api-reference-react`) |
| CSN      | `csn/index.tsx`      | `@sap/csn-interop-renderer` (inside ShadowRoot for CSS isolation)                                 |
| AsyncAPI | `asyncApi/index.tsx` | `@asyncapi/react-component`                                                                       |
| A2A      | `a2a/index.tsx`      | `AgentCardView` from `@open-resource-discovery/a2a-editor/card-view`                              |
| MCP      | `mcp/index.tsx`      | `MCPServerCardView` from `@open-resource-discovery/mcp-server-card-ui/card-view`                  |

### Entry points

The lib build produces separate entry points for tree-shaking: `index`, `openapi`, `csn`, `asyncapi`, `a2a`, `mcp`, `styles`. The `styles` entry is a side-effect-only file that aggregates CSS from all renderers into a single `dist/index.css`.

### CSS isolation

The ORD card libraries (a2a-editor, mcp-server-card-ui) are Tailwind v4 and re-bundle `@open-resource-discovery/ui-components`' hand-written, `.ord-ui`-scoped reset (via `@import "…/ui-components/styles"` in their own `styles.css`). That reset — `.ord-ui :where(*){margin:0;padding:0}` plus border-box rules — has **real specificity `(0,1,0)`** (the `.ord-ui` class sits outside the `:where()`), so it is _not_ harmless: it matches every `.ord-ui` subtree on the page.

The earlier "it's in `@layer base`, so unlayered host resets always win" reasoning only protects the **host page**. It does **not** protect a consumer that renders its own `@open-resource-discovery/ui-components` components: those are also wrapped in `.ord-ui`, so a second, late-loaded copy of this reset (one from a2a, one from mcp, aggregated into our `dist/index.css`) re-zeroes the consumer's own padding/margins (e.g. their cards).

The fix lives **upstream** in a2a-editor and mcp-server-card-ui: their library build (`vite.config.ts`, lib mode) runs a `confineOrdUiReset` PostCSS step that rewrites every bare `.ord-ui` to the compound `.a2a-root.ord-ui` / `.mcp-root.ord-ui` (the card root is the same element as `.ord-ui`), and `:root`/`:host` theme blocks to that same card root. A build-time safety gate fails if any bare `.ord-ui` survives. overlay-editor already avoids the leak the same way (`scopeToCardView()` in its standalone config). As a result, `dist/index.css` here must contain **zero** bare `.ord-ui :where(*)` rules — only confined `.a2a-root.ord-ui …` / `.mcp-root.ord-ui …` copies. (The old `stripUnscopedPreflight` Vite plugin remains commented out in `vite.config.ts` with no implementation.)

Note: Scalar teleports its search modal to `#headlessui-portal-root` on `document.body`, outside any renderer container. A consumer must therefore **not** re-scope our `dist/index.css` under a wrapper class (e.g. via a selector-prefixing script) — doing so is what breaks the search popup, because the teleported modal escapes that wrapper. With the `.ord-ui` leak fixed upstream, consumers can import `/styles` globally and drop any such workaround.

CSN renders in **light DOM** — a `.csn-root` div with an inline `<style>`, isolated purely by the `.csn-root` class prefix on every rule. (A `ShadowRoot` wrapper exists at `src/lib/core/ShadowRoot.tsx` but is not currently used by CsnRenderer.)

### Styling

For how each renderer is themed — native library output vs. this project's custom components, the `--ord-*` token flow, per-renderer mechanisms, and environment gotchas — see [STYLING.md](STYLING.md).

### OpenAPI SAP attributes

`src/lib/openApi/sapAttributes/` contains plugin renderers for SAP-specific OpenAPI extensions (`x-sap-*`). These are injected into the Scalar renderer via the plugin system in `openApi/utils/plugins.ts`. Attributes are organized by scope: `root/`, `operation/`, `schema/`.

### Build externalization

The lib build externalizes **all** dependencies — including a2a-editor and mcp-server-card-ui. Consumers' bundlers resolve them. Only CSS is inlined.

### Scalar version pinning (do not use caret ranges)

`@scalar/api-reference` styles its layout grid and search modal with **Vue scoped styles** — selectors like `.references-layout[data-v-f08574be]` whose hash changes every Scalar version and must match the `data-v-…` attribute the running JS stamps on the DOM. Because the lib build **inlines Scalar's CSS** into `dist/index.css` but **externalizes Scalar's JS**, the consumer resolves the JS version independently. If that version differs from the one the CSS was inlined from, the hashes don't match and Scalar's layout silently collapses to a stacked/narrow layout and the search modal renders unstyled.

Therefore `@scalar/api-reference`, `@scalar/api-reference-react`, `@scalar/react-renderer`, and `@scalar/types` are all pinned to **exact** versions (not caret), so a consumer resolves the same JS whose CSS is inlined.

`@scalar/api-reference` is a **direct** dependency even though `@scalar/api-reference-react` also pins it transitively: the OpenAPI renderer imports `createApiReference` from it to mount Scalar directly (see [the OpenAPI note below](#openapi-mounts-scalar-directly)), and `dist` imports it by bare specifier, so it must be a declared dependency to resolve under strict/pnpm consumers — it cannot be left transitive-only. That means the Scalar JS version is now encoded in two places (`@scalar/api-reference` and `@scalar/types` are declared both directly here and transitively by the wrapper), so **pinning the react wrapper alone is no longer sufficient**. Two mechanisms keep the pins in lockstep:

1. **Renovate `Scalar` group** (`renovate.json`): all `@scalar/*` packages bump together in one PR, and that PR never automerges (a Scalar bump needs the manual re-verification below).
2. **`scalarVersionLockstep` test** (`src/lib/openApi/scalarVersionLockstep.test.ts`): fails CI if any `@scalar/*` we declare directly drifts from the version `@scalar/api-reference-react` pins transitively.

**Any Scalar bump is a lockstep change**: bump the exact pins together, run `npm install`, rebuild (CSS re-inlines), confirm `scalarVersionLockstep` passes, and re-verify the two metadata-renderer→Scalar CSS integrations against the new version's variable/class names — the theming map in `openApi/utils/scalarTheme.ts` (`--ord-*` → `--scalar-*` on `.scalar-app`/`.t-doc__sidebar`/`.dark-mode`/`#headlessui-portal-root`) and the sidebar-height override in `openApi/styles.ts` (`--refs-sidebar-height`, `--refs-header-height`, `--scalar-container-height`). These use named hooks (not the `data-v` hash), but a version can still rename them.

#### OpenAPI mounts Scalar directly

`openApi/index.tsx` mounts Scalar via `createApiReference` from `@scalar/api-reference`, **not** through `@scalar/api-reference-react`'s `ApiReferenceReact` component (the wrapper is used only for its inlined CSS and its re-exported config type). The wrapper's effect cleanup returns `instance.destroy` and so tears Scalar down **synchronously during React's commit**, which chains into Vue `app.unmount()` → `@scalar/react-renderer`'s nested react-dom `root.unmount()` and makes React 19 log "Attempted to synchronously unmount a root while React was already rendering." Mounting directly lets us defer `destroy()` to a `queueMicrotask` so teardown runs after the host commit. Each remount gets its **own fresh child container** inside the stable host div, because `createApiReference` mounts onto (and `destroy()` clears) the element it is given — a shared element would let an outgoing instance's deferred teardown blank out the incoming one, and a non-empty element makes Scalar mount in SSR/hydration mode.

## Path aliases

`@/` → `src/`, `@lib/` → `src/lib/`, `@demo/` → `src/demo/` (configured in `vite.config.ts` and `tsconfig.app.json`).
