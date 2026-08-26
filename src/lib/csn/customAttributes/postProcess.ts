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

type AnnotationRun = { key: string; valueNode: Node; codeEl: Element };

// If `node` is an `@Key:` text node whose `next` sibling is <code> (or <a> containing
// <code>), return the run details; otherwise null. Shared by the apply and strip passes.
function matchAnnotationRun(node: Node, next: Node | undefined): AnnotationRun | null {
    if (node.nodeType !== Node.TEXT_NODE) return null;

    const text = (node.textContent ?? '').replace(/^\s+/, '');
    const match = /^@([\w.]+):\s*$/.exec(text);
    if (!match) return null;

    // Next sibling must be <code> or <a> containing <code>
    if (!next || next.nodeType !== Node.ELEMENT_NODE) return null;
    const el = next as Element;

    let codeEl: Element | null = null;
    if (el.tagName === 'CODE') {
        codeEl = el;
    } else if (el.tagName === 'A') {
        codeEl = el.querySelector('code');
    }
    if (!codeEl) return null;

    return { key: `@${match[1]}`, valueNode: next, codeEl };
}

// Collect all @Key: <code> (or @Key: <a><code>) pairs in a <td>, without mutating.
function collectAnnotationPairs(td: Element, renderers: Map<string, RendererEntry>): AnnotationPair[] {
    const pairs: AnnotationPair[] = [];
    const childNodes = Array.from(td.childNodes);

    for (let i = 0; i < childNodes.length - 1; i++) {
        const run = matchAnnotationRun(childNodes[i], childNodes[i + 1]);
        if (!run) continue;

        const entry = renderers.get(run.key);
        if (!entry) continue;

        pairs.push({ textNode: childNodes[i], valueNode: run.valueNode, codeEl: run.codeEl, key: run.key, entry });
    }

    return pairs;
}

// Skip a single whitespace-only text node when looking backwards for a <br> separator.
function precedingBr(textNode: Node): Node | null {
    let prev = textNode.previousSibling;
    if (prev && prev.nodeType === Node.TEXT_NODE && !(prev.textContent ?? '').trim()) {
        prev = prev.previousSibling;
    }
    return prev && prev.nodeType === Node.ELEMENT_NODE && (prev as Element).tagName === 'BR' ? prev : null;
}

// When custom attributes are disabled, remove every @Key: <code> (or @Key: <a><code>) run
// so the library's default annotation rows are not shown. Non-annotation content (type:,
// doc/markdown) is left untouched. Mirrors the AsyncAPI "hide extensions when disabled" fix.
export function stripAllAnnotations(html: string): string {
    const domDoc = new DOMParser().parseFromString(html, 'text/html');

    for (const container of Array.from(domDoc.querySelectorAll('td, p'))) {
        const childNodes = Array.from(container.childNodes);

        // Read-only pass: collect runs (any key) plus each run's preceding <br> separator,
        // holding node references so removals below don't invalidate later entries.
        const runs: Array<{ textNode: Node; valueNode: Node; br: Node | null }> = [];
        for (let i = 0; i < childNodes.length - 1; i++) {
            const run = matchAnnotationRun(childNodes[i], childNodes[i + 1]);
            if (!run) continue;
            runs.push({ textNode: childNodes[i], valueNode: run.valueNode, br: precedingBr(childNodes[i]) });
        }

        for (const { textNode, valueNode, br } of runs) {
            replaceNodeRun(container, textNode, valueNode, '');
            if (br && br.parentNode === container) container.removeChild(br);
        }
    }

    return domDoc.body.innerHTML;
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
