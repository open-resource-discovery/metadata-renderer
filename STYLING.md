# Styling guide (for maintainers)

How to change the look of each renderer. There are two distinct layers everywhere:

- **Native styling** — the appearance of the *underlying library's* own output (Scalar, the CSN interop renderer, the AsyncAPI React component, …). We don't own this markup, so we theme it indirectly.
- **Custom-component styling** — the appearance of the fields/annotations *this project* injects (the SAP custom attributes and CSN annotations).

Two things that apply to **every** renderer:

1. **Theme tokens are `--ord-*` CSS custom properties.** A caller passes a `theme` (`RendererTheme`) prop, or builds one with `createTheme()` ([src/lib/theme-builder.ts](src/lib/theme-builder.ts)). The playground's Theme Editor edits these live.
2. **The website loads the *built* package.** `website/` depends on `@sap/metadata-renderer` via a `file:..` link that resolves to `dist/`. So **changes to `src/` do not appear on the Docusaurus site until you run `npm run build`.** For fast iteration use `npm run dev` (the Vite demo at localhost:5173), which reads `src/` directly and hot-reloads. After editing, `npm run lint` + `npm run build`.

---

## CSN — [src/lib/csn/](src/lib/csn/)

Wraps `@sap/csn-interop-renderer`, which outputs an **HTML string** (not React). We render that string with `dangerouslySetInnerHTML` inside a `.csn-root` div in **light DOM** (despite an out-of-date comment mentioning a ShadowRoot — there is none).

**All CSN CSS lives in one file: [src/lib/csn/styles.ts](src/lib/csn/styles.ts)** — a single template-literal string injected as an inline `<style>` inside `.csn-root` ([src/lib/csn/index.tsx](src/lib/csn/index.tsx)). This covers both the native table and our custom annotations. To change anything about CSN's appearance, edit that file.

- **Native (the table).** The `@sap/csn-interop-renderer` output is a plain `<table>`. We style it with `.csn-root table`, `… th`, `… td`, etc. Values use the `--ord-*` tokens with hardcoded fallbacks.
- **Custom annotations.** Rendered by post-processing the HTML ([customAttributes/postProcess.ts](src/lib/csn/customAttributes/postProcess.ts)): the generated HTML is parsed with `DOMParser`, and `@Key: <code>value</code>` pairs are replaced with `.csn-attr-row` / `.csn-attr-label` / `.csn-attr-value` spans (built in [customAttributes/genericRenderer.ts](src/lib/csn/customAttributes/genericRenderer.ts)). The class taxonomy is `.csn-attr-{row,label,value,list,list-item,obj,kv,kv-key,kv-val,link,doclink}`. Style them in `styles.ts`.

**Gotchas:**
- **Docusaurus/Infima sets a global `table { display: block }`.** That silently breaks `table-layout: fixed` and column widths. We counter it with `display: table` on `.csn-root table` — do not remove it.
- **Responsive layout uses CSS container queries.** `.csn-root` declares `container: csn / inline-size`, and `@container csn (max-width: …)` blocks flip attribute rows from side-by-side to stacked. There are two breakpoints because element-level annotations sit in `<td>` (narrow) and entity/service-level ones sit in `<p>` (wide) — see the comments in `styles.ts`.
- Array values render as inline `<span>`s, **not** `<ul>/<li>`, because those rows also appear inside `<p>` where block elements get hoisted out of the paragraph by the HTML parser.

---

## AsyncAPI — [src/lib/asyncApi/](src/lib/asyncApi/)

Wraps `@asyncapi/react-component` (a React component). Its base CSS is imported directly (`@asyncapi/react-component/styles/default.css`) — a Tailwind-utility stylesheet.

- **Native styling is override-by-injection.** `buildAsyncApiThemeStyle(id, theme)` in [src/lib/asyncApi/index.tsx](src/lib/asyncApi/index.tsx) builds a `<style>` that overrides the library's Tailwind utility classes (`.bg-white`, `.bg-gray-100`, `.text-gray-700`, …) by mapping them to `--ord-*` values, all scoped under `[data-renderer-id="<id>"]`. To retheme the native output, edit the rule list in that function. This is inherently coupled to the library's Tailwind class names, so it can drift when the library updates.
- **Custom-field styling is classNames + a stylesheet.** Custom fields render via React components ([customAttributes/genericRenderer.tsx](src/lib/asyncApi/customAttributes/genericRenderer.tsx), plus [customAttributes/stateInfo.tsx](src/lib/asyncApi/customAttributes/stateInfo.tsx)) carrying `.asyncapi-attr-*` classes, styled by the injected stylesheet [customAttributes/styles.ts](src/lib/asyncApi/customAttributes/styles.ts). Edit that file to change custom-field appearance. (There is **no** `styling.ts` with inline style objects any more — it was removed in favour of this stylesheet.)

**Gotchas** (see the `layoutStyle` block and comments in `index.tsx`):
- The wrapper declares `container: asyncapi-attrs / inline-size` so custom-field rows react to the renderer width and collapse together (`@container asyncapi-attrs (max-width: …)` in `styles.ts`).
- The library's long dotted event identifiers (e.g. `sap.grc.irm.Foo.Create.v1`) have no break points and force a wide minimum; we add `overflow-wrap: anywhere` so they wrap instead of forcing a horizontal scrollbar.
- The wrapper is a bounded scroll viewport (`height: 100%; overflow: auto; scrollbar-gutter: stable`).
- **Do not restyle the library's example-section buttons directly.** The native theming rule was widened to `.rounded:not(.inline-block) { overflow: hidden }` specifically because a plain `.rounded { overflow: hidden }` shifts the baseline of the library's inline `rounded` button pills (an inline-block with `overflow` uses its bottom edge as baseline), which misaligns their chevrons. Keep the `:not(.inline-block)` exclusion.

---

## OpenAPI — [src/lib/openApi/](src/lib/openApi/)

Wraps Scalar (`@scalar/api-reference-react`). Scalar renders everything under `.scalar-app`, inside our `[data-renderer-id]` div.

- **Native styling is via Scalar's own `--scalar-*` CSS variables.** `buildScalarThemeStyles(id, theme)` ([utils/scalarTheme.ts](src/lib/openApi/utils/scalarTheme.ts)) maps our `--ord-*` tokens onto Scalar's `--scalar-*` variables (background, colors, sidebar, etc.), injected as a `<style>` scoped by `[data-renderer-id]`. To retheme native Scalar output, edit that mapping. This is the cleanest of the three native layers because Scalar exposes a real token API.
- **Custom SAP fields render via a Scalar plugin** ([utils/plugins.ts](src/lib/openApi/utils/plugins.ts)) and are styled with `.sap-api-*` classes in the injected stylesheet [src/lib/openApi/styles.ts](src/lib/openApi/styles.ts). Class taxonomy: `.sap-api-{container,label,value,label--root,value--root,list,link,placeholder,obj,obj-row,obj-key,obj-val}`. Both the generic renderer ([customAttributes/genericRenderer.tsx](src/lib/openApi/customAttributes/genericRenderer.tsx)) and the hand-written scope renderers under [customAttributes/sapAttributes/](src/lib/openApi/customAttributes/sapAttributes/) use these classes. The custom-field stylesheet **uses `--scalar-*` variables** (not `--ord-*`) so it visually matches Scalar's own chrome.

**Gotchas:**
- **Responsive rows work differently here than in AsyncAPI.** OpenAPI puts `container-type: inline-size` on **each `.sap-api-container` row** (with `flex-wrap: wrap`) and uses an *unnamed* `@container (max-width: 420px)` block. AsyncAPI instead puts a *named* container on the wrapper. This asymmetry is intentional: the wrapper-container approach did not fire correctly for the plugin-rendered rows inside Scalar's DOM, so the row-level container is what works here. Don't "unify" them without testing in the real Scalar render.
- The value cell uses `flex: 1 1 0; min-width: 0` so long values fill the remaining row width instead of wrapping onto their own line on wide screens.

---

<!-- A2A, MCP, and the shared build/token infrastructure sections are appended below. -->

---

## A2A — [src/lib/a2a/](src/lib/a2a/) and MCP — [src/lib/mcp/](src/lib/mcp/)

These two are grouped because they work identically. Each wraps a card component from an ORD package — `AgentCardView` (`@open-resource-discovery/a2a-editor/card-view`) and `MCPServerCardView` (`@open-resource-discovery/mcp-server-card-ui/card-view`) — and each renderer is a thin ~40-line wrapper with **no project-specific presentation components to style**.

- **Native styling is entirely token-driven.** Both libraries ship a prebuilt stylesheet (imported side-effect-only) built as a shadcn/Tailwind-v4 design system scoped under two root classes: `.a2a-root` / `.mcp-root` (the reset/component rules) and `.ord-ui` (which *defines* the `--ord-*` token defaults). There are ~60–110 tokens: base (`--ord-background`, `--ord-foreground`, `--ord-primary`, `--ord-border`, `--ord-radius`, …) plus per-component groups (`--ord-button-*`, `--ord-badge-*`, `--ord-card-*`, dialog/select/switch/tabs/tooltip/avatar/…). Each component token inherits from a semantic token by default, so overriding a semantic token cascades, and overriding a component token affects only that component.
- **To change the look, override `--ord-*` tokens** via the `theme` prop — you don't edit the vendored library CSS. When a `theme` is passed, the renderer calls `buildShadcnThemeStyle('a2a-root' | 'mcp-root', id, theme)` ([src/lib/core/utils.ts](src/lib/core/utils.ts)) and injects the returned string as a per-instance `<style>` scoped `[data-renderer-id="<id>"] .a2a-root.ord-ui { … }`. That helper (`mapShadcnTheme`) also derives missing card/popover tokens from background/foreground, appends `px` to `--ord-radius`, and emits an un-prefixed alias for every token (`--ord-primary` → also `--primary`) for shadcn compatibility. **This is the single place to change A2A/MCP theming logic.**
- **Light/dark is class-driven, not media-query.** Each library exposes a `useTheme()` hook; the renderer calls `setTheme('dark' | 'light')` based on whether the `className` prop contains the token `dark`. If the host doesn't pass a `dark` className, dark mode never activates.

**Gotchas:**
- **No custom components** — there's no `.css` file in `src/lib/a2a/` or `src/lib/mcp/`. All styling is either the vendored library CSS or `--ord-*` overrides via `buildShadcnThemeStyle`.
- **No shadow DOM** — isolation relies solely on the `.a2a-root` / `.mcp-root` / `.ord-ui` class scoping, plus the Tailwind-v4 `@layer base` cascade behavior for the preflight reset (see Shared infrastructure below).
- **MCP feeds content through a shared Zustand store** (`useServerCardStore.setRawJson`), a singleton — multiple MCP renderers on one page can contend on the same store state.

---

## Shared infrastructure

**The `--ord-*` token system is the contract.** `RendererTheme = Partial<Record<`--ord-${string}`, string>>` ([src/lib/types.ts](src/lib/types.ts)) — every renderer accepts a `theme` prop of these tokens and applies it as inline `style` on its root. [src/lib/theme-builder.ts](src/lib/theme-builder.ts) offers a typed ergonomic builder: `createTheme(tokens)` maps ~24 camelCase semantic names (`primaryForeground` → `--ord-primary-foreground`, etc.) to the CSS-variable form. The full token surface (as exercised by the playground Theme Editor at [website/src/components/Playground/ThemeEditor/](website/src/components/Playground/ThemeEditor/)) is broader — semantic + sidebar + `--ord-hljs-*` syntax colors + a large per-component override set.

**How native theming differs per renderer** — worth internalizing, because "change the theme" means different things:

| Renderer | Native token namespace | How `--ord-*` reaches the library |
| --- | --- | --- |
| A2A / MCP | `--ord-*` (native) | Directly — library *is* `--ord-*`-based; override via `buildShadcnThemeStyle` |
| OpenAPI | `--scalar-*` | Mapped `--ord-*` → `--scalar-*` in `scalarTheme.ts` |
| AsyncAPI | Tailwind classes | `--ord-*` values compiled into class overrides in `buildAsyncApiThemeStyle` |
| CSN | `--ord-*` (fallbacks) | Directly, as `var(--ord-*, fallback)` in `styles.ts` |

**CSS aggregation & build** ([src/lib/styles.ts](src/lib/styles.ts), [vite.config.ts](vite.config.ts)):
- `src/lib/styles.ts` is a side-effect-only aggregator re-importing the third-party stylesheets (a2a-editor, mcp-server-card-ui, asyncapi, scalar). Consumers get it via `import '@sap/metadata-renderer/styles'`. **It deliberately does NOT include CSN styles** — those ship inside the JS bundle as the inline `<style>` string.
- The lib build inlines all this CSS into a single `dist/index.css` (`cssCodeSplit: false`, `assetFileNames` renames to `index.css`), keyed by the `styles` entry not being externalized. Build is `minify: false` on purpose (avoids consumer scope-hoisting TDZ issues).
- **`stripUnscopedPreflight` Vite plugin:** an older mechanism that stripped a2a-editor's Tailwind preflight reset at build time. It's **commented out in `vite.config.ts` and has no implementation** — and that's fine: it's no longer needed. The ORD card libraries are Tailwind v4, which wraps its preflight in `@layer base`. Layered styles lose to the host page's unlayered resets (Docusaurus/Infima) regardless of specificity, so the reset ships in `dist/index.css` but can't leak into the host page. (The old plugin was needed under Tailwind v3, whose preflight was unlayered.)

**Where changes show up:**
- `npm run dev` (Vite demo, localhost:5173) reads `src/` directly via `@`/`@lib`/`@demo` aliases — **live, no rebuild.** Use this to iterate on styling.
- The Docusaurus website depends on the **built package** (`"@sap/metadata-renderer": "file:.."`), so it consumes `dist/`. Its `prestart`/`prebuild` hooks rebuild the lib first, but a running dev server won't pick up `src/` edits until a rebuild. **`npm run build` is required to see styling changes on the website.**

**Key shared files:** [src/lib/styles.ts](src/lib/styles.ts), [src/lib/theme-builder.ts](src/lib/theme-builder.ts), [src/lib/types.ts](src/lib/types.ts), [src/lib/core/utils.ts](src/lib/core/utils.ts) (`buildShadcnThemeStyle`/`mapShadcnTheme`), [vite.config.ts](vite.config.ts).
