import { findScrollParent, sidebarHeight } from './sidebarHeight.js';

describe('findScrollParent', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    function nest(...overflows: string[]): HTMLElement {
        let parent: HTMLElement = document.body;
        for (const overflowY of overflows) {
            const el = document.createElement('div');
            el.style.overflowY = overflowY;
            parent.appendChild(el);
            parent = el;
        }
        const leaf = document.createElement('div');
        parent.appendChild(leaf);
        return leaf;
    }

    it('returns the nearest ancestor that scrolls vertically', () => {
        const leaf = nest('auto', 'visible', 'scroll', 'visible');
        expect(findScrollParent(leaf)?.style.overflowY).toBe('scroll');
    });

    it('treats a clipping ancestor as the scroll parent, as position: sticky does', () => {
        const leaf = nest('hidden', 'visible');
        expect(findScrollParent(leaf)?.style.overflowY).toBe('hidden');
    });

    it('returns null when only the document scrolls', () => {
        expect(findScrollParent(nest('visible', 'visible'))).toBeNull();
    });
});

describe('sidebarHeight', () => {
    it('uses the container height when the host bounds the container', () => {
        expect(sidebarHeight(600, 600, 900)).toBe(600);
        expect(sidebarHeight(600, null, 900)).toBe(600);
    });

    it('caps an auto-height container at the visible part of its scroll container', () => {
        expect(sidebarHeight(2747, 809, 900)).toBe(809);
    });

    it('caps at the viewport when there is no scroll container or it is taller', () => {
        expect(sidebarHeight(2747, null, 900)).toBe(900);
        expect(sidebarHeight(2747, 3000, 900)).toBe(900);
    });
});
