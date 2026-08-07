---
sidebar_position: 4
title: Custom Attributes
---

# Custom Attributes

The OpenAPI, **AsyncAPI**, and **CSN** renderers all support rendering of vendor-specific custom fields directly inside the rendered document. Matching fields are discovered automatically from the document content using a prefix, and you can provide type hints or custom React components for specific fields.

All three renderers share the same configuration model — a per-prefix config object with auto-discovery, optional per-field type hints, and a built-in SAP preset — but they differ in the details because each wraps a different underlying library:

| Format   | Config type                      | Option key | Field/annotation naming           | SAP preset                    |
| -------- | -------------------------------- | ---------- | --------------------------------- | ----------------------------- |
| OpenAPI  | `OpenApiCustomAttributesConfig`  | `openapi`  | `x-*` extensions (e.g. `x-sap-*`) | `sapOpenApiAttributesConfig`  |
| AsyncAPI | `AsyncApiCustomAttributesConfig` | `asyncapi` | `x-*` extensions (e.g. `x-sap-*`) | `sapAsyncApiAttributesConfig` |
| CSN      | `CsnCustomAttributesConfig`      | `csn`      | `@Vocabulary.term` annotations    | `sapCsnAttributesConfig`      |

The OpenAPI system is documented in full first; the [AsyncAPI](#asyncapi-custom-attributes) and [CSN](#csn-custom-attributes) sections below focus on what differs.

## Default behaviour (SAP preset)

This library has built-in support for SAP custom fields defined in the following specifications:

- OpenAPI — https://github.com/SAP/openapi-specification/tree/main/sap-schemas/v3.0
- AsyncAPI — https://github.com/SAP/asyncapi-specification/
- CSN — the SAP interoperable CSN vocabularies (`@EndUserText`, `@ObjectModel`, `@PersonalData`, `@ODM`, `@API`, …)

:::info
If you are not following SAP specifications in your metadata files, you can still use custom attribute rendering for your own extension namespaces — see [Configuring custom attributes](#configuring-custom-attributes) below. If you don't use extension attributes at all, consider disabling the feature via `customAttributes: false`. See [How it works](./How%20it%20works) for more about the library's design.
:::

Out of the box, each renderer recognises its SAP custom fields and renders them with sensible labels, links to the specification, and specialised components for complex types. This happens automatically — nothing to configure:

```tsx
// SAP attributes render automatically for OpenAPI, AsyncAPI, and CSN
<MetadataRenderer content={document} />
```

To disable custom attribute rendering entirely (all formats), pass `customAttributes: false`:

```tsx
<MetadataRenderer content={document} options={{ customAttributes: false }} />
```

## Configuring custom attributes

The examples in this section use **OpenAPI**; the pattern is identical for AsyncAPI (`asyncapi` key) and CSN (`csn` key), with the format-specific differences described in their own sections below.

Pass `options.customAttributes.openapi` to override or replace the default preset. Each entry in the array is an `OpenApiCustomAttributesConfig` that covers one prefix:

```tsx
import { MetadataRenderer } from '@open-resource-discovery/metadata-renderer';

<MetadataRenderer
    content={openapiDocument}
    options={{
        customAttributes: {
            openapi: [
                {
                    prefixStartsWith: 'x-acme-',
                    documentationUrl: (attributeName) => `https://docs.acme.com/openapi-extensions#${attributeName}`,
                },
            ],
        },
    }}
/>;
```

All attributes whose names start with `x-acme-` are discovered automatically and rendered with auto-generated labels. A documentation link icon appears next to each label.

### Multiple prefix sets

To handle multiple independent extension namespaces in a single document, pass more than one config object:

```tsx
options={{
    customAttributes: {
        openapi: [
            {
                prefixStartsWith: 'x-sap-',
                documentationUrl: (name, { version }) =>
                    `https://github.com/SAP/openapi-specification/tree/main/sap-schemas/v${version}#${name}`,
            },
            {
                prefixStartsWith: 'x-acme-',
                documentationUrl: (name) =>
                    `https://docs.acme.com/openapi-extensions#${name}`,
            },
        ],
    },
}}
```

## `OpenApiCustomAttributesConfig`

| Property           | Type                                                          | Description                                                                                                                        |
| ------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `prefixStartsWith` | `string`                                                      | Auto-discover all document attributes whose names start with this prefix.                                                          |
| `documentationUrl` | `(attributeName: string, ctx: { version: string }) => string` | Builds the URL for the external-link icon shown next to each attribute label. Omit to hide the icon.                               |
| `extensions`       | `Record<string, AttributeDefinition>`                         | Per-attribute overrides. Provide a `type` hint for the generic renderer or a fully custom `component`. Omit to use auto-detection. |

## Attribute types

When an attribute is discovered automatically (no explicit `extensions` entry), the renderer infers its type from the value:

- **array** → bulleted list
- **object** → JSON representation
- **everything else** → plain string

You can override the inferred type per attribute using the `extensions` map.

### `type: 'string'`

```ts
extensions: {
    'x-acme-tier': { type: 'string', label: 'Service Tier' },
    'x-acme-owner': { type: 'string' }, // label auto-generated as "Owner"
}
```

Optionally provide `valueLinks` to make specific enum values into hyperlinks:

```ts
'x-acme-tier': {
    type: 'string',
    label: 'Service Tier',
    valueLinks: {
        gold:   'https://docs.acme.com/tiers/gold',
        silver: 'https://docs.acme.com/tiers/silver',
    },
},
```

### `type: 'array'`

```ts
'x-acme-tags': { type: 'array', label: 'Tags' }
```

Renders the array value as a bulleted list.

### `type: 'object'`

```ts
'x-acme-metadata': { type: 'object', label: 'Metadata' }
```

Renders the object as a JSON string.

### `type: 'link'`

```ts
'x-acme-entity': {
    type: 'link',
    label: 'Business Entity',
    callback: (value) => `https://api.acme.com/entities/${value}/`,
},
```

The `callback` receives the raw attribute value and must return a URL string (or `undefined` to fall back to plain text).

## Custom React components

For complex attributes that need bespoke rendering, provide a `component` function. The component receives the full data object passed by Scalar; the attribute value is available under a camelCase property derived from the attribute name (`x-acme-state-info` → `xAcmeStateInfo`).

```tsx
import type { OpenApiCustomAttributesConfig } from '@open-resource-discovery/metadata-renderer';

const acmeConfig: OpenApiCustomAttributesConfig = {
    prefixStartsWith: 'x-acme-',
    extensions: {
        'x-acme-state-info': {
            component: ({ xAcmeStateInfo }: { xAcmeStateInfo: { state: string } }) => (
                <div style={{ color: xAcmeStateInfo.state === 'active' ? 'green' : 'grey' }}>
                    {xAcmeStateInfo.state}
                </div>
            ),
        },
    },
};
```

## Using the SAP preset as a base

Import `sapOpenApiAttributesConfig` to extend the built-in SAP preset rather than replacing it:

```ts
import { sapOpenApiAttributesConfig } from '@open-resource-discovery/metadata-renderer';
import type { OpenApiCustomAttributesConfig } from '@open-resource-discovery/metadata-renderer';

const myConfig: OpenApiCustomAttributesConfig = {
    ...sapOpenApiAttributesConfig,
    extensions: {
        ...sapOpenApiAttributesConfig.extensions,
        // override the ODM entity name attribute with a custom link target
        'x-sap-odm-entity-name': {
            type: 'link',
            label: 'ODM Entity',
            callback: (value) => `https://api.sap.com/businessobjects/sap.odm.${value}/`,
        },
    },
};
```

## Using directly with `OpenApiRenderer`

If you are using `OpenApiRenderer` directly instead of `MetadataRenderer`, pass the config via the `customAttributes` prop:

```tsx
import { OpenApiRenderer } from '@open-resource-discovery/metadata-renderer/openapi';

<OpenApiRenderer content={openapiDocument} customAttributes={[acmeConfig]} />;
```

Pass `showCustomAttributes={false}` to disable rendering without passing a config.

---

# AsyncAPI custom attributes

The AsyncAPI renderer uses the same `x-*` extension model as OpenAPI. Configure it via `options.customAttributes.asyncapi` (an array of `AsyncApiCustomAttributesConfig`), or pass `customAttributes` directly to `AsyncApiRenderer`. The SAP preset `sapAsyncApiAttributesConfig` (prefix `x-sap-`, 20 fields) is applied by default.

```tsx
<MetadataRenderer
    content={asyncapiDocument}
    options={{
        customAttributes: {
            asyncapi: [
                {
                    prefixStartsWith: 'x-acme-',
                    documentationUrl: (name) => `https://docs.acme.com/asyncapi-extensions#${name}`,
                },
            ],
        },
    }}
/>
```

## `AsyncApiCustomAttributesConfig`

| Property           | Type                                                          | Description                                                                                                             |
| ------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `prefixStartsWith` | `string`                                                      | Auto-discover all fields whose names start with this prefix, anywhere in the document.                                  |
| `documentationUrl` | `(attributeName: string, ctx: { version: string }) => string` | Builds the URL for the external-link icon next to each field label. `ctx.version` is the document's `asyncapi` version. |
| `extensions`       | `Record<string, AsyncApiAttributeDefinition>`                 | Per-field overrides, keyed by the **full field name including the `x-` prefix** (e.g. `'x-acme-tier'`).                 |

The `extensions` keys, the `type` hints (`'string'`, `'boolean'`, `'number'`, `'array'`, `'object'`, `'link'`), `valueLinks`, and `link` `callback` all behave exactly as documented for OpenAPI above.

### Where fields are discovered

Unlike OpenAPI (which surfaces extensions per schema/operation), AsyncAPI auto-discovery walks the whole document across both **AsyncAPI v2 and v3** locations: the root, `info`, channels (and v2 `subscribe`/`publish`/`send`/`receive` operations and their messages), v3 top-level `operations`, and `components` (`messages`, `messageTraits`, `schemas`). Root/`info`-level fields — which the underlying library does not expose through its per-field extension slots — are rendered via a dedicated plugin injected into the Info section.

### Custom React components

For AsyncAPI, a custom `component` receives the library's `ExtensionComponentProps`. The field value arrives as **`propertyValue`** and the field name as `propertyName` (there is **no** camelCase property derivation as in OpenAPI):

```tsx
import type { AsyncApiCustomAttributesConfig } from '@open-resource-discovery/metadata-renderer';

const acmeConfig: AsyncApiCustomAttributesConfig = {
    prefixStartsWith: 'x-acme-',
    extensions: {
        'x-acme-state-info': {
            component: ({ propertyValue }: { propertyValue: { state: string } }) => (
                <div style={{ color: propertyValue.state === 'active' ? 'green' : 'grey' }}>{propertyValue.state}</div>
            ),
        },
    },
};
```

The built-in SAP preset uses this mechanism for `x-sap-stateInfo` (rendered by an `AsyncApiStateInfo` lifecycle-badge component).

### Extending the SAP preset / using the renderer directly

```ts
import { sapAsyncApiAttributesConfig } from '@open-resource-discovery/metadata-renderer';
```

```tsx
import { AsyncApiRenderer } from '@open-resource-discovery/metadata-renderer/asyncapi';

<AsyncApiRenderer content={asyncapiDocument} customAttributes={[acmeConfig]} />;
```

Pass `showCustomAttributes={false}` to disable rendering without a config.

---

# CSN custom attributes

CSN (CSN Interop) uses **annotations** rather than `x-*` extensions, so its configuration differs from OpenAPI/AsyncAPI in naming while keeping the same overall shape. Annotations are keyed by their full dotted `@Vocabulary.term` (e.g. `@EndUserText.label`, `@ObjectModel.modelingPattern`). Configure via `options.customAttributes.csn` (an array of `CsnCustomAttributesConfig`) or the `customAttributes` prop on `CsnRenderer`. The SAP preset `sapCsnAttributesConfig` (39 annotations across `EndUserText`, `ObjectModel`, `Consumption`, `PersonalData`, `Semantics`, `API`, `ODM`, `Aggregation`, `EntityRelationship`, `DataIntegration`) is applied by default.

```tsx
<MetadataRenderer
    content={csnDocument}
    options={{
        customAttributes: {
            csn: [
                {
                    prefixStartsWith: '@acme.',
                    documentationUrl: (name) => `https://docs.acme.com/csn-annotations#${name}`,
                    annotations: {
                        '@acme.owner': { type: 'string', label: 'Owner' },
                    },
                },
            ],
        },
    }}
/>
```

## `CsnCustomAttributesConfig`

| Property           | Type                                              | Description                                                                                                                                                  |
| ------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prefixStartsWith` | `string`                                          | Auto-discover annotation keys starting with this prefix, across the document's `definitions` and their `elements`. Defaults to `'@'` (i.e. all annotations). |
| `documentationUrl` | `(annotationName: string) => string \| undefined` | Given the full annotation key (e.g. `'@EndUserText.label'`), returns a doc URL; when truthy, a `↗` link is appended after the label.                         |
| `annotations`      | `Record<string, CsnAnnotationDefinition>`         | Per-annotation overrides, keyed by the **full dotted key including the leading `@`** (e.g. `'@EndUserText.label'`).                                          |

Note the field is named `annotations` (not `extensions`), and keys include the `@` prefix instead of `x-`.

## `CsnAnnotationDefinition`

The same `type` hints as the other renderers — `'string'` (with optional `valueLinks`), `'boolean'`, `'number'`, `'array'`, `'object'`, and `'link'` (with a `callback`) — plus one CSN-specific escape hatch:

```ts
annotations: {
    // return raw HTML for full control (bypasses built-in formatting)
    '@acme.badge': { render: (value) => `<span class="badge">${String(value)}</span>` },
}
```

CSN has **no** React-component option (the underlying renderer emits HTML, not React — see below); the `render` function is the equivalent escape hatch, returning an HTML string.

### CSN value shapes

CSN encodes some values specially, and the renderer unwraps them automatically:

- **Enum values** arrive as `{ "#": "VALUE" }` — rendered as just `VALUE` (e.g. `{ "#": "ACTIVE" }` → `ACTIVE`).
- **Element references** arrive as `{ "=": "elementName" }` — rendered as a key/value pair (`=` → `elementName`).
- **Arrays** and **objects** render as nested lists / key-value pairs.

Labels are auto-generated from the key by stripping the prefix, splitting on `.`, capitalising each segment, and joining with `·` — so `@EndUserText.label` becomes **EndUserText · Label**. Provide `label` on a definition to override.

### Link annotations

`type: 'link'` annotations both render as an anchor **and** feed the underlying `@sap/csn-interop-renderer`'s official `annotationLinkCallbacks` hook, so links are produced through the library's sanctioned mechanism rather than only via post-processing.

### How CSN rendering works (why it differs)

`@sap/csn-interop-renderer` outputs an **HTML string**, not React elements. So custom annotations are applied by a post-processing pass: the generated HTML is parsed with `DOMParser`, `@Key: <code>value</code>` pairs (in table cells for element-level annotations, and in paragraphs for entity/service-level ones) are located and replaced with styled attribute rows. This is transparent to consumers — the API mirrors the other renderers — but it's why customisation uses a `render` HTML function instead of a React `component`.

### Using the renderer directly

```tsx
import { CsnRenderer } from '@open-resource-discovery/metadata-renderer/csn';
import { sapCsnAttributesConfig } from '@open-resource-discovery/metadata-renderer';

<CsnRenderer content={csnDocument} customAttributes={[sapCsnAttributesConfig]} />;
```

Pass `showCustomAttributes={false}` to disable rendering without a config.
