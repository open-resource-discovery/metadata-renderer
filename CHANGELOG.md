# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) rules.

## [unreleased]

### Added

- **Overlay renderer** for [ORD Overlay](https://open-resource-discovery.org/) 0.1 documents,
  via the published [@open-resource-discovery/overlay-editor](https://www.npmjs.com/package/@open-resource-discovery/overlay-editor)
  package. Auto-detected from documents carrying an `ordOverlay` version string and a
  `patches` array, and dispatched to the new `OverlayRenderer`.
- New public export `OverlayRenderer` (and its `OverlayRendererProps` type), plus a
  tree-shakable `@open-resource-discovery/metadata-renderer/overlay` subpath entry point.
- `overlay` added to the `MetaType` union, the default renderer map, and protocol labels;
  `extractVersion` now reports the `ordOverlay` version for the badge.
- Demo app tab and website Playground example (with an Overlay logo) for the new format.
- Overlay renderer: inline `<code>` elements are now styled with the `--ord-code-fg` and
  `--ord-code-bg` theme tokens (falling back to `--ord-foreground` / `--ord-muted`, then a
  literal), scoped to the renderer instance.

### Fixed

- AsyncAPI: the `PluginSlot` runtime value is now imported from the `@asyncapi/react-component`
  browser build instead of the default (Node) entry. The default entry pulled in the full
  `@asyncapi/parser` tree (`@asyncapi/avro-schema-parser` → `avsc`), which references Node
  builtins (`Buffer`, `crypto`, `util`) and crashed browser consumers with
  `Cannot read properties of undefined (reading 'alloc')`. The Avro parser is no longer bundled,
  removing the need for `crypto`/`stream`/`events` polyfills in consuming apps.
- OpenAPI renderer: the underlying Scalar component adds a `light-mode`/`dark-mode` class to
  `document.body` and never removes it on unmount, leaking `color-scheme` onto the host page and
  forcing a white background after the renderer was navigated away from. `OpenApiRenderer` now
  strips those classes on unmount so the host page follows its own theme again.
- Playground: the Theme Editor and Options panels no longer lose their state when switching
  between them. They were rendered via a ternary at the same tree position, so opening the other
  panel unmounted the first and reset all its local state; both panels now stay mounted with
  visibility toggled via CSS, preserving the selected theme, custom colors, and Options toggles.
- Overlay renderer: the mobile sidebar footer (shown on narrow layouts) now uses the same
  `--ord-background` / `--ord-muted-foreground` colors as the wide-layout footer and tracks
  the Theme Editor selection, instead of rendering with default light-theme colors.
- AsyncAPI: message- and messageTrait-level custom attributes (`x-*`) are now hidden when
  `customAttributes` is not passed. Previously only document-root attributes were hidden while
  the library's default per-message "Extensions" section still rendered the message-level ones.
- CSN: `@`-annotations are now hidden when `customAttributes` is not passed. Previously the
  library's default annotation rows still rendered even with custom attributes disabled; the
  generated HTML is now post-processed to strip them, leaving names, types, and descriptions intact.
- AsyncAPI: the Examples section now follows the upstream responsive border radius: square below
  the `2xl` breakpoint and themed rounded corners at `2xl` and above.

### Changed

- Playground toolbar extracted into a standalone full-width bar rendered above the resizable panels, so toolbar controls remain visible and consistently positioned regardless of panel size or resize operations
- Toolbar controls (format selector, type selector, Copy, Clear, Theme Editor, Options) lifted out of the editor panel and are now accessible without resizing or scrolling within a panel
- Monaco editor height now fills remaining viewport space via flexbox layout instead of a hardcoded `calc(100vh - ...)` value, improving correctness across different screen sizes and when the toolbar height changes
- Documentation site: the Infima primary/accent color palette (light and dark) now derives from the logo color instead of the default Docusaurus green.

## [[1.0.1](https://github.com/open-resource-discovery/metadata-renderer/releases/tag/rel/1.0.1)] - 2026-08-12

### Changed

- `customAttributes` now defaults to **disabled**. Pass
  `{ openapi: [sapOpenApiAttributesConfig], asyncapi: [sapAsyncApiAttributesConfig], csn: [sapCsnAttributesConfig] }`
  to opt in to the SAP preset, or provide your own config. Passing `false` explicitly
  disables all custom-attribute rendering.
- `options.showSAPCustomFields` removed (was deprecated in earlier builds). Use
  `customAttributes` instead.
- `showCustomAttributes` prop removed from `OpenApiRenderer`, `AsyncApiRenderer`, and
  `CsnRenderer` — enabled state is now derived purely from whether `customAttributes` is
  passed.

## [[1.0.0](https://github.com/open-resource-discovery/metadata-renderer/releases/tag/rel/1.0.0)] - 2026-08-07

### Added

- A2A renderer powered by `@open-resource-discovery/a2a-editor` (`AgentCardView`).
- MCP server card renderer powered by `@open-resource-discovery/mcp-server-card-ui`
  (`MCPServerCardView`).
- Theme editor in the playground for live customization of renderer styles.
- Auto-detection badge that displays the detected protocol and version in the playground.
- Rendering custom attributes
    - Generic custom attributes system for the OpenAPI renderer — any vendor extension prefix
      (e.g. `x-acme-*`) can now be configured, not only SAP. Matching attributes are
      auto-discovered from the document; strings, arrays, objects, and links render with
      sensible defaults and auto-generated labels.
    - `options.customAttributes` on `MetadataRendererOptions` — accepts a
      `CustomAttributesOptions` object (`{ openapi: [...] }`) or `false` to disable rendering
      entirely. The `openapi` array supports multiple independent prefix configurations in a
      single document.
    - New public types: `OpenApiCustomAttributesConfig` (`prefixStartsWith`, `documentationUrl`,
      `extensions`), `AttributeDefinition` (discriminated union: `type: 'string' | 'array' |
'object' | 'link'` or a custom `component`), `CustomAttributesOptions`.
    - `sapOpenApiAttributesConfig` — the built-in SAP preset exported as a named constant;
      importable to extend or replace.
    - Documentation: _Custom Attributes_ page covering default behaviour, configuring a custom
      prefix, multiple prefix sets, attribute types, custom React components, and extending the
      SAP preset.
    - Generic custom attributes system for the **AsyncAPI** renderer, mirroring the OpenAPI
      system. Root-level `x-sap-*` fields render via the library's `PluginSlot.INFO` plugin
      (replacing the previous document-mutation workaround), and field discovery covers both
      AsyncAPI v2 and v3 document locations.
    - Generic custom attributes system for the **CSN** renderer. Because
      `@sap/csn-interop-renderer` emits HTML strings (not React components), annotations are
      rendered by post-processing the generated HTML: the output is parsed with `DOMParser`
      and `@Key: <code>value</code>` pairs are replaced with styled attribute rows. Undeclared
      annotation keys are auto-discovered from the document.
    - `customAttributes` prop on `AsyncApiRenderer` and `CsnRenderer` (matching
      `OpenApiRenderer`), plus `asyncapi` and `csn` keys on `CustomAttributesOptions`.
    - New public exports: `AsyncApiCustomAttributesConfig`, `AsyncApiAttributeDefinition`,
      `sapAsyncApiAttributesConfig`; `CsnCustomAttributesConfig`, `CsnAnnotationDefinition`,
      `sapCsnAttributesConfig`.
    - Built-in SAP presets for the new renderers: `sapAsyncApiAttributesConfig` (20 `x-sap-*`
      fields) and `sapCsnAttributesConfig` (38 annotations across the 11 SAP interoperable
      vocabularies). AsyncAPI adds an `AsyncApiStateInfo` component for `x-sap-stateInfo`
      lifecycle badges.
    - CSN renderer: responsive design for tables and custom fields — columns and attribute
      rows adapt to the width available to the renderer (via CSS container queries), stacking
      vertically when space is tight.
    - OpenAPI and AsyncAPI renderers: custom fields are now width-adaptive too — each
      label/value row switches from side-by-side to stacked (label above value) when its
      available width is tight, via CSS container queries, matching the CSN behaviour.
    - `renderers` prop on `MetadataRenderer` — an optional `RendererMap` that controls which
      renderer components are active. When omitted, all five renderers are included (same
      behavior as before). When provided explicitly, bundlers can tree-shake out the renderers
      that are not imported, reducing bundle size.
    - `RendererMap` type — `Partial<Record<MetaType, RendererEntry>>` — exported from the
      main entry.
    - `MetadataRendererOptions` type and optional `options` prop on `MetadataRenderer`:
        - `autoDetect` — set to `false` to disable format auto-detection and require an
          explicit `type` prop (default: `true`).
        - `fallback` — `'error'` (default) shows a styled message for unsupported/disabled
          types; `'raw'` renders the content in a `<pre>` block.
        - `csn`, `asyncapi`, `a2a`, `mcp` — format-specific options passed through to each
          renderer (replaces the old top-level `config` prop for CSN).

### Changed

- Migrated the project from a hybrid web-components + React setup to **React only**. The
  library now ships React components exclusively; the web-components wrapper has been
  removed.
- Removed Nx from the repository — `nx.json`, `project.json`, and all `nx ...`
  scripts/targets are gone. Builds and tests now run directly via `npm`/`vite`/`vitest`.
- CI workflow updated to drop Nx, drop the Playwright container, and run `lint`,
  `typecheck`, `test`, the library build, and the website build directly.
- Overhauled styling across all renderers (OpenAPI, CSN, AsyncAPI, A2A, MCP) for a
  consistent look in both light and dark themes, and to play nicely when embedded in
  external sites (Docusaurus, etc.).
- AsyncAPI dark theme rendering fixed and aligned with the rest of the renderers.
- Scalar (OpenAPI) sidebar and main panel restyled; syntax highlighting improved.
- CSN renderer now isolated inside a Shadow DOM so its styles cannot leak into the host
  page.
- Website CSS layer order aligned so renderer styles no longer override
  Docusaurus/Infima.
- Remove vendor/ tarballs now that packages are published on npm.
- Replace local `ui-components` file dependency with published `a2a-editor` in website.
- Remove `watchLocalDeps` webpack plugin and rolldown shim (no longer needed).
- Regenerate `package-lock` files against the npmjs registry.
- Changes in rendering custom attributes
    - SAP custom attribute rendering now runs through the generic renderer. All existing SAP
      complex components (`extOverview`, `stateInfo`, `extensible`, `deprecatedOperation`,
      `odmEntityName`, `odmSemanticKey`) are preserved inside `sapOpenApiAttributesConfig`.
    - `Attributes.md` removed; its content has been merged into `Custom Attributes.md`.
    - Upgraded `@asyncapi/react-component` from `^2.6.5` to `^3.1.3` to unlock the plugin
      API used by the AsyncAPI custom attributes system.
    - CSN custom-attribute post-processing rewritten from raw-string regex to DOM-based
      extraction (`DOMParser` + node walk), removing the fragile manual entity-unescaping
      step. Link-type annotations now flow through the library's official
      `annotationLinkCallbacks` hook. Handles both element-level (`<td>`) and
      entity/service-level (`<p>`) placements.
    - Restructured OpenAPI custom attributes: `sapAttributes` is now a subfolder of
      `customAttributes`; generic array/object rendering improved.
    - Refreshed appearance of custom fields across the OpenAPI, AsyncAPI, and CSN renderers
      (styling, spacing, documentation links), and applied a consistent font family throughout
      the CSN renderer.
    - OpenAPI and AsyncAPI custom-field styling moved out of inline React style objects into a
      single injected stylesheet per renderer (the `styling.ts` modules are removed); elements
      now carry classNames, which is what makes the container-query responsive layout possible.
- Removed the top-level `config` prop from `MetadataRenderer`. Use `options.csn` instead.
- Theme panel resize handle in the playground is now enabled (was accidentally disabled).

### Fixed

- OpenAPI: schema-level custom attributes are now shown (they are not rendered natively).
- SAP predefined custom attributes corrected to match the specification.
- CSN: array-valued custom fields now render correctly inside entity/service-level rows
  (previously the value was dropped and the list leaked out of its container).
- OpenAPI viewer: ORD sidebar theme tokens now correctly style the Scalar search input —
  background, text color, and border color are applied via the sidebar theme map.
- OpenAPI viewer: sidebar height now respects the container size when embedded in
  Docusaurus or other non-fullscreen layouts by overriding Scalar's
  `--refs-sidebar-height` variable instead of the inner list height.

### Security

- Override `dompurify` to `^3.4.12` to address multiple XSS vulnerabilities (CVE range
  affecting `<=3.4.10`) bundled inside `monaco-editor@0.55.1`.
- Override `serialize-javascript` to `^7.0.3` in the website to address a code injection
  vulnerability (affecting `<=7.0.2`) used by `@docusaurus/bundler`.
- Override `uuid` to `^14.0.1` in the website to address a related Dependabot alert.
- Downgrade direct `monaco-editor` dependency in the website from `^0.55.0` to `^0.53.0`
  to avoid the vulnerable range (`0.54.0-dev-20250909 – 0.56.0-dev-20260211`) that ships
  a vulnerable `dompurify`.
