import type { CsnAnnotationDefinition, CsnCustomAttributesConfig } from './types';
import { buildCsnAnnotationHtml } from './genericRenderer';

type Rec = Record<string, unknown>;

type RendererEntry = { def: CsnAnnotationDefinition | undefined; config: CsnCustomAttributesConfig };

type AnnotationPair = {
    textNode: Node;
    valueNode: Node;
    codeEl: Element;
    key: string;
    entry: RendererEntry;
};

export function discoverAnnotationKeys(doc: Rec, prefix: string): string[] {
    const keys = new Set<string>();
    const addFromObj = (obj: unknown) => {
        if (!obj || typeof obj !== 'object') return;
        for (const k of Object.keys(obj as Rec)) {
            if (k.startsWith(prefix)) keys.add(k);
        }
    };

    const definitions = doc.definitions as Rec | undefined;
    if (definitions) {
        for (const def of Object.values(definitions)) {
            addFromObj(def);
            const elements = (def as Rec | undefined)?.elements as Rec | undefined;
            if (elements) {
                for (const el of Object.values(elements)) addFromObj(el);
            }
        }
    }

    return [...keys];
}

function parseCodeValue(decoded: string): unknown {
    try {
        return JSON.parse(decoded);
    } catch {
        return decoded;
    }
}

function replaceNodeRun(parentNode: Node, startNode: Node, endNode: Node, replacementHtml: string): void {
    const tpl = (parentNode.ownerDocument as Document).createElement('template');
    tpl.innerHTML = replacementHtml;
    parentNode.insertBefore(tpl.content, startNode);

    let cur: Node | null = startNode;
    while (cur) {
        const next: Node | null = cur.nextSibling;
        const done = cur === endNode;
        parentNode.removeChild(cur);
        if (done) break;
        cur = next;
    }
}

// Collect all @Key: <code> (or @Key: <a><code>) pairs in a <td>, without mutating.
function collectAnnotationPairs(td: Element, renderers: Map<string, RendererEntry>): AnnotationPair[] {
    const pairs: AnnotationPair[] = [];
    const childNodes = Array.from(td.childNodes);

    for (let i = 0; i < childNodes.length - 1; i++) {
        const node = childNodes[i];
        if (node.nodeType !== Node.TEXT_NODE) continue;

        const text = (node.textContent ?? '').replace(/^\s+/, '');
        const match = /^@([\w.]+):\s*$/.exec(text);
        if (!match) continue;

        const key = `@${match[1]}`;
        const entry = renderers.get(key);
        if (!entry) continue;

        // Next sibling must be <code> or <a> containing <code>
        const valueNode = childNodes[i + 1];
        if (!valueNode || valueNode.nodeType !== Node.ELEMENT_NODE) continue;
        const el = valueNode as Element;

        let codeEl: Element | null = null;
        if (el.tagName === 'CODE') {
            codeEl = el;
        } else if (el.tagName === 'A') {
            codeEl = el.querySelector('code');
        }
        if (!codeEl) continue;

        pairs.push({ textNode: node, valueNode, codeEl, key, entry });
    }

    return pairs;
}

export function applyAnnotationRenderers(html: string, configs: CsnCustomAttributesConfig[], doc: Rec | null): string {
    const renderers = new Map<string, RendererEntry>();

    for (const config of configs) {
        for (const [key, def] of Object.entries(config.annotations ?? {})) {
            if (!renderers.has(key)) renderers.set(key, { def, config });
        }
        if (config.prefixStartsWith && doc) {
            for (const key of discoverAnnotationKeys(doc, config.prefixStartsWith)) {
                if (!renderers.has(key)) {
                    renderers.set(key, { def: undefined, config });
                }
            }
        }
    }

    if (renderers.size === 0) return html;

    const domDoc = new DOMParser().parseFromString(html, 'text/html');

    for (const td of Array.from(domDoc.querySelectorAll('td, p'))) {
        // Collect all matching annotation pairs first (read-only pass), then replace.
        // This avoids index-tracking bugs from mid-loop DOM mutations.
        const pairs = collectAnnotationPairs(td, renderers);

        for (const { textNode, valueNode, codeEl, key, entry } of pairs) {
            // textContent is already HTML-decoded by the browser — feed directly to JSON.parse
            const value = parseCodeValue(codeEl.textContent ?? '');
            const rendered = buildCsnAnnotationHtml(key, value, entry.def, entry.config);
            if (rendered) replaceNodeRun(td, textNode, valueNode, rendered);
        }
    }

    return domDoc.body.innerHTML;
}
