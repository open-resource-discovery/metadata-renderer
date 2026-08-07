import type { CsnAnnotationDefinition, CsnCustomAttributesConfig } from './types';

function autoLabel(key: string, prefix?: string): string {
    let name = key;
    if (prefix && name.startsWith(prefix)) name = name.slice(prefix.length);
    return name
        .split('.')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' · ');
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderValue(value: unknown, def: CsnAnnotationDefinition | undefined): string {
    if (value === null || value === undefined) return '';

    if (def && 'render' in def) return def.render(value) as string;

    if (def?.type === 'link' && 'callback' in def) {
        const href = def.callback(value);
        const text = escapeHtml(String(value));
        return href
            ? `<a href="${escapeHtml(href)}" class="csn-attr-link" target="_blank" rel="noreferrer">${text}</a>`
            : text;
    }

    if (def?.type === 'boolean' || typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (def?.type === 'number' || typeof value === 'number') {
        return escapeHtml(String(value));
    }

    if (def?.type === 'array' || Array.isArray(value)) {
        if (!Array.isArray(value)) return escapeHtml(String(value));
        // Inline-safe markup (spans, not <ul>/<li>): these rows are also emitted inside
        // <p> for entity/service-level annotations, where block elements get hoisted out.
        const items = value
            .map((item) => `<span class="csn-attr-list-item">${renderValue(item, undefined)}</span>`)
            .join('');
        return `<span class="csn-attr-list">${items}</span>`;
    }

    if (def?.type === 'object' || (typeof value === 'object' && value !== null)) {
        const entries = Object.entries(value as Record<string, unknown>);
        if (entries.length === 1 && entries[0][0] === '#') {
            return escapeHtml(String(entries[0][1]));
        }
        const rows = entries
            .map(
                ([k, v]) =>
                    `<span class="csn-attr-kv"><span class="csn-attr-kv-key">${escapeHtml(k)}</span><span class="csn-attr-kv-val">${renderValue(v, undefined)}</span></span>`,
            )
            .join('');
        return `<span class="csn-attr-obj">${rows}</span>`;
    }

    if (def && 'valueLinks' in def && def.valueLinks) {
        const href = def.valueLinks[String(value)];
        const text = escapeHtml(String(value));
        return href
            ? `<a href="${escapeHtml(href)}" class="csn-attr-link" target="_blank" rel="noreferrer">${text}</a>`
            : text;
    }

    return escapeHtml(String(value));
}

export function buildCsnAnnotationHtml(
    key: string,
    value: unknown,
    def: CsnAnnotationDefinition | undefined,
    config: CsnCustomAttributesConfig,
): string {
    if (value === null || value === undefined) return '';

    const label =
        def && !('render' in def) && 'label' in def && def.label
            ? def.label
            : autoLabel(key, config.prefixStartsWith ?? '@');

    const docUrl = config.documentationUrl?.(key);
    const docLink = docUrl
        ? ` <a href="${escapeHtml(docUrl)}" class="csn-attr-doclink" target="_blank" rel="noreferrer" title="Documentation">↗</a>`
        : '';

    const valueHtml = renderValue(value, def);
    if (!valueHtml) return '';

    return `<span class="csn-attr-row"><span class="csn-attr-label">${escapeHtml(label)}${docLink}</span><span class="csn-attr-value">${valueHtml}</span></span>`;
}
