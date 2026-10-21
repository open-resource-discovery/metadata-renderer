/**
 * Nearest ancestor a `position: sticky` descendant sticks within — one that clips or scrolls
 * vertically — or `null` when that is the document itself.
 */
export function findScrollParent(el: HTMLElement): HTMLElement | null {
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
        if (/^(auto|scroll|overlay|hidden)$/.test(getComputedStyle(node).overflowY)) return node;
    }
    return null;
}

/**
 * Height for Scalar's sticky sidebar (`--scalar-container-height`, see `styles.ts`): the renderer's
 * own box, but never taller than what is visible of it — the nearest scroll container and the
 * viewport. In a host that bounds the box this is just the box; in one that doesn't, the box is as
 * tall as Scalar's layout, which is as tall as the sidebar, so measuring the box alone would let the
 * height grow and never shrink back to the content.
 */
export function sidebarHeight(
    containerHeight: number,
    scrollPortHeight: number | null,
    viewportHeight: number,
): number {
    return Math.min(containerHeight, scrollPortHeight ?? Infinity, viewportHeight);
}
