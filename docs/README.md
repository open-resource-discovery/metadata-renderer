# Adding a New Protocol

This guide walks a contributor through wiring a new metadata protocol into `@sap/metadata-renderer` end-to-end. It is contributor-facing; for end-user documentation see `website/docs/`.

## Overview

A "protocol" here means a metadata format (OpenAPI, MCP, A2A, AsyncAPI, CSN) that:

1. Is **detected** by content shape — a single function in `src/lib/core/utils.ts` returns a `MetaType` literal for any input string.
2. Is **rendered** by a thin React wrapper around a third-party component, living at `src/lib/<protocol>/index.tsx`.
3. Is **dispatched** by a top-level `<MetadataRenderer content={...} />` that switches on the detected type.

Protocols shipped today:

| Slug       | Library wrapped                               | Wrapper                      |
| ---------- | --------------------------------------------- | ---------------------------- |
| `openapi`  | `@scalar/api-reference-react`                 | `src/lib/openApi/index.tsx`  |
| `csn`      | `@sap/csn-interop-renderer`                   | `src/lib/csn/index.tsx`      |
| `asyncapi` | `@asyncapi/react-component`                   | `src/lib/asyncApi/index.tsx` |
| `a2a`      | `@open-resource-discovery/a2a-editor`         | `src/lib/a2a/index.tsx`      |
| `mcp`      | `@open-resource-discovery/mcp-server-card-ui` | `src/lib/mcp/index.tsx`      |

Pick the existing wrapper closest to what you need and copy it.

## Architecture Quick Map

| Path                                                      | Role                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| `src/lib/core/utils.ts`                                   | `MetaType` union + `detectMetaType()`. The only detection logic.   |
| `src/lib/core/index.tsx`                                  | `MetadataRenderer` dispatcher. `switch` on detected type.          |
| `src/lib/<protocol>/index.tsx`                            | Per-protocol wrapper component.                                    |
| `src/lib/entries/<protocol>.ts`                           | One-line re-export — Vite named-entry stub.                        |
| `src/lib/index.ts`                                        | Public barrel.                                                     |
| `src/lib/styles.ts`                                       | CSS aggregator (`@sap/metadata-renderer/styles`).                  |
| `vite.config.ts` `build.lib.entry`                        | Lib entry registration.                                            |
| `website/src/components/Playground/example.tsx`           | `fileExamples` array — playground chips.                           |
| `website/src/components/Playground/icons/`                | SVG logos for playground chips.                                    |
| `website/src/components/Playground/ThemeEditor/adapters/` | Optional — only if the new renderer uses non-shadcn CSS variables. |

## Step-by-Step

### 1. Pick a `MetaType` slug

Lowercase, single word: `graphql`, `protobuf`, `raml`. Use it consistently — directory name, entry name, type literal.

### 2. Add detection

Edit `src/lib/core/utils.ts`. Extend the `MetaType` union and add a branch in `detectMetaType()`:

```ts
export type MetaType = 'csn' | 'openapi' | 'asyncapi' | 'a2a' | 'mcp' | 'graphql' | 'unknown';

// inside detectMetaType, in priority order
if (typeof o.graphqlSchema === 'string') {
    return 'graphql';
}
```

**Order matters.** The first match wins. Place tighter shapes (more required fields) above looser ones. See the MCP-before-A2A example in the file: both carry a `capabilities` object, but MCP additionally requires a `$schema` referencing `modelcontextprotocol` plus `supportedProtocolVersions`, so MCP is checked first.

Add at least one positive and one negative test case to `src/lib/core/utils.test.ts`. If your shape can be confused with an existing protocol, add a disambiguation test (mirror `should prefer MCP over A2A when both shapes overlap`).

### 3. Create the renderer

`src/lib/graphql/index.tsx`:

```tsx
import { GraphQLViewer } from 'some-graphql-renderer';

export type GraphqlRendererProps = {
    content: string;
};

export function GraphqlRenderer({ content }: GraphqlRendererProps) {
    return <GraphQLViewer source={content} />;
}
```

The exported names are conventional: `<Protocol>Renderer` + `<Protocol>RendererProps`. Props always take `content: string`.

**Lazy-load** if the third-party dep imports Node builtins (`Buffer`, `fs`, `util.promisify`) at module init. AsyncAPI does — see `src/lib/core/index.tsx`:

```tsx
const AsyncApiRenderer = lazy(() => import('../asyncApi').then((m) => ({ default: m.AsyncApiRenderer })));
```

If you skip this and the dep needs Node builtins, the lib bundle will break in the browser at module-load time.

### 4. Wire dispatch

In `src/lib/core/index.tsx`, import and add a `case`:

```tsx
import { GraphqlRenderer } from '../graphql';

switch (metaType) {
    // ...
    case 'graphql':
        return <GraphqlRenderer content={content} />;
}
```

### 5. Add a build entry

Create `src/lib/entries/graphql.ts`:

```ts
export { GraphqlRenderer } from '../graphql';
export type { GraphqlRendererProps } from '../graphql';
```

Register it in `vite.config.ts` under `build.lib.entry`:

```ts
build.lib.entry = {
    // ...
    graphql: resolve(__dirname, 'src/lib/entries/graphql.ts'),
};
```

This produces `dist/graphql.js` so consumers can `import { GraphqlRenderer } from '@sap/metadata-renderer/graphql'` without pulling the rest of the bundle.

### 6. Public barrel

In `src/lib/index.ts`, add two lines:

```ts
export { GraphqlRenderer } from './graphql';
export type { GraphqlRendererProps } from './graphql';
```

### 7. Aggregate styles

If the third-party renderer ships its own CSS, append a side-effect import to `src/lib/styles.ts`:

```ts
import 'some-graphql-renderer/styles.css';
```

`vite.config.ts` has a `stripUnscopedPreflight` plugin that removes any unscoped Tailwind preflight (`*,:after,:before { ... }`) at build time — this is why `a2a-editor`'s preflight does not leak into consumer pages. If your dep ships an unscoped preflight, the strip plugin handles it; verify in the playground that no host chrome (Docusaurus navbar, panel handles) is altered after building.

### 8. Add a playground example

Drop an SVG icon in `website/src/components/Playground/icons/graphql-logo.svg`. Append to the `fileExamples` array in `website/src/components/Playground/example.tsx`:

```tsx
import GraphqlLogo from './icons/graphql-logo.svg';

const graphqlExample = `# inline example here`;

export const fileExamples = [
    // ...
    {
        name: 'GraphQL',
        extension: 'json', // or 'yaml'
        content: graphqlExample,
        image: {
            dark: <GraphqlLogo className={styles.img} />,
            light: <GraphqlLogo className={styles.img} />,
        },
    },
];
```

The `image.dark` / `image.light` split lets you ship two SVGs if the logo needs different strokes per theme; otherwise reuse the same import.

### 9. Theme adapter (optional)

**Only needed if the renderer's CSS variables don't match the shadcn token surface** (`--primary`, `--background`, `--card`, `--radius`, …). Renderers like MCP and A2A already use shadcn-flavored variables and work out of the box.

Create `website/src/components/Playground/ThemeEditor/adapters/graphql.ts` implementing the `ThemeAdapter` interface:

```ts
import type { ThemeAdapter } from './types';

const GRAPHQL_MAP: Record<string, string[]> = {
    '--primary': ['--graphql-accent-color'],
    '--background': ['--graphql-bg'],
    // ...
};

export const graphqlAdapter: ThemeAdapter = {
    selector: '.graphql-root',
    map(canonical) {
        const out: Record<string, string> = {};
        for (const [name, value] of Object.entries(canonical)) {
            const targets = GRAPHQL_MAP[name];
            if (!targets) continue;
            for (const t of targets) out[t] = value;
        }
        return out;
    },
};
```

Add it to the `ADAPTERS` array in `registry.ts`. See `scalar.ts` for a non-trivial reference where one canonical token (`--primary`) fans out to three Scalar variables (`--scalar-color-accent`, `--scalar-button-1`, `--scalar-link-color`).

## Verification Checklist

Before opening a PR:

- `npm test` — detection tests pass, including your new positive/negative cases.
- `npm run build` — lib builds cleanly, no Vite externalization warnings, `dist/graphql.js` exists.
- `cd website && npm start` — playground loads, the new chip shows the example, the renderer paints, no console errors, theme editor doesn't crash.
- If you wrote a theme adapter: change `--primary` in the editor with the new chip selected — confirm visible recoloring. If you intentionally skipped the adapter, document the gap in your PR description.

## Known Constraints

- **Detection priority matters.** The first match in `detectMetaType()` wins. New branches go in the right slot — tightest shapes first.
- **Node builtins must be lazy-loaded.** Any third-party renderer that touches `Buffer`, `fs`, or `util.promisify` at module-init time goes through `lazy(() => import(...))` in `src/lib/core/index.tsx`. AsyncAPI is the reference.
- **The `/styles` import escape hatch is intentional.** `vite.config.ts` externalizes JS subpaths of declared deps but inlines CSS subpaths so the styles aggregator can produce a single `dist/index.css`. Don't "fix" this.
- **ShadowRoot renderers can't be themed externally.** CSN is rendered in a ShadowRoot with hardcoded colors — the theme editor cannot reach them. New renderers using ShadowRoots inherit the same gap unless they expose CSS custom-property hooks at the host element.
