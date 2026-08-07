---
sidebar_position: 2
---

# Usage

After installing `@sap/metadata-renderer`, import the React component and the bundled stylesheet.

## Importing styles

The stylesheet import is side-effecting and must appear **once** in your application — typically in your entry file alongside other global stylesheets:

```ts
import '@sap/metadata-renderer/styles';
```

Without this import the renderers will have no styling.

## Basic usage

`MetadataRenderer` auto-detects the format and dispatches to the right renderer. One import is all you need:

```tsx
import { MetadataRenderer } from '@sap/metadata-renderer';
import '@sap/metadata-renderer/styles';

export function MyView({ file }: { file: string }) {
    return <MetadataRenderer content={file} />;
}
```

All five formats (OpenAPI, CSN, AsyncAPI, A2A, MCP) are supported out of the box.

### Props

| Prop        | Type                      | Required | Description                                                                                                           |
| ----------- | ------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `content`   | `string`                  | ✓        | Metadata document as a string (YAML or JSON).                                                                         |
| `renderers` | `RendererMap`             | —        | Map of format keys to renderer components. Defaults to all renderers. Pass an explicit subset to enable tree-shaking. |
| `options`   | `MetadataRendererOptions` | —        | Behavioral options. See [Options](#options).                                                                          |
| `type`      | `MetaType`                | —        | Override auto-detection. One of `'openapi'`, `'csn'`, `'asyncapi'`, `'a2a'`, `'mcp'`.                                 |
| `className` | `string`                  | —        | Extra CSS class on the renderer root. Pass `'dark'` to activate dark mode.                                            |
| `theme`     | `RendererTheme`           | —        | Custom CSS token overrides. See [Theming](#theming).                                                                  |

## Tree-shaking with individual renderers

Because `renderers` is an explicit map you control, bundlers can statically see which renderer
modules are imported and drop the rest. To render only A2A and OpenAPI documents:

```tsx
import { MetadataRenderer } from '@sap/metadata-renderer';
import { OpenApiRenderer } from '@sap/metadata-renderer/openapi';
import { A2ARenderer } from '@sap/metadata-renderer/a2a';

<MetadataRenderer content={file} renderers={{ openapi: OpenApiRenderer, a2a: A2ARenderer }} />;
```

CSN, AsyncAPI, and MCP code is not included in the bundle at all.

## Options

Pass an `options` object to fine-tune behavior:

```tsx
<MetadataRenderer
    content={file}
    renderers={renderers}
    options={{
        autoDetect: true,
        fallback: 'error',
        a2a: { showValidation: true, showConnection: false },
        mcp: { showValidation: true },
        csn: {/* CsnRendererConfig */},
        asyncapi: {/* Partial<ConfigInterface> */},
    }}
/>
```

### `MetadataRendererOptions`

| Option             | Type                                                     | Default    | Description                                                                                                                                                            |
| ------------------ | -------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoDetect`       | `boolean`                                                | `true`     | Auto-detect format from `content` when `type` is not set. When `false`, an explicit `type` prop is required; otherwise the fallback is shown.                          |
| `fallback`         | `'error' \| 'raw'`                                       | `'error'`  | What to render when the format cannot be handled (unknown, or no renderer registered). `'error'` shows a styled message; `'raw'` shows the content in a `<pre>` block. |
| `customAttributes` | `CustomAttributesOptions \| false`                       | SAP preset | Custom extension attribute renderers per protocol. Pass `false` to disable all custom attribute rendering. See [Custom Attributes](./Custom%20Attributes).             |
| `csn`              | `CsnRendererConfig`                                      | —          | Passed through to `CsnRenderer`.                                                                                                                                       |
| `asyncapi`         | `Partial<ConfigInterface>`                               | —          | Passed through to `AsyncApiRenderer`.                                                                                                                                  |
| `a2a`              | `{ showValidation?: boolean; showConnection?: boolean }` | —          | Passed through to `A2ARenderer`.                                                                                                                                       |
| `mcp`              | `{ showValidation?: boolean }`                           | —          | Passed through to `McpRenderer`.                                                                                                                                       |

## Individual renderer props

Each renderer accepts `content`, `className`, and `theme`. Additional props:

| Renderer           | Extra props                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| `OpenApiRenderer`  | `showCustomAttributes?: boolean`, `customAttributes?: OpenApiCustomAttributesConfig[]` |
| `CsnRenderer`      | `config?: CsnRendererConfig`                                                           |
| `AsyncApiRenderer` | `config?: Partial<ConfigInterface>`                                                    |
| `A2ARenderer`      | `showValidation?: boolean`, `showConnection?: boolean`                                 |
| `McpRenderer`      | `showValidation?: boolean`                                                             |

## Theming

Pass a `theme` prop to override the default color tokens. Use the `createTheme` helper for a type-safe camelCase API:

```tsx
import { MetadataRenderer, createTheme } from '@sap/metadata-renderer';
import { OpenApiRenderer } from '@sap/metadata-renderer/openapi';

const theme = createTheme({
    primary: '#0098ff',
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    muted: '#2d2d30',
    mutedForeground: '#969696',
    border: '#3e3e42',
});

export function MyView({ file }: { file: string }) {
    return <MetadataRenderer content={file} renderers={{ openapi: OpenApiRenderer }} theme={theme} />;
}
```

For dark mode, combine `theme` with `className="dark"`:

```tsx
<MetadataRenderer content={file} renderers={renderers} className="dark" theme={theme} />
```

`createTheme` accepts the following tokens (all optional):

| Token                                   | Description                                    |
| --------------------------------------- | ---------------------------------------------- |
| `background`                            | Page / panel background                        |
| `foreground`                            | Default text color                             |
| `primary` / `primaryForeground`         | Brand accent and its text                      |
| `secondary` / `secondaryForeground`     | Secondary surfaces                             |
| `muted` / `mutedForeground`             | Subdued surfaces and text                      |
| `accent` / `accentForeground`           | Hover / highlight surfaces                     |
| `card` / `cardForeground`               | Card background and text                       |
| `popover` / `popoverForeground`         | Dropdown / popover background and text         |
| `destructive` / `destructiveForeground` | Danger color                                   |
| `success` / `successForeground`         | Success color                                  |
| `warning` / `warningForeground`         | Warning color                                  |
| `border`                                | Border color                                   |
| `input`                                 | Input border color                             |
| `ring`                                  | Focus ring color                               |
| `radius`                                | Border radius (px value as string, e.g. `'8'`) |

You can also provide raw `--ord-*` CSS custom properties directly as the `RendererTheme` type:

```tsx
import type { RendererTheme } from '@sap/metadata-renderer';

const theme: RendererTheme = {
    '--ord-primary': '#0098ff',
    '--ord-background': '#1e1e1e',
};
```
