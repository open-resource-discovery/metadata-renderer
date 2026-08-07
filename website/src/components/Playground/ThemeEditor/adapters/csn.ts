import type { ThemeAdapter } from './types';

export const csnAdapter: ThemeAdapter = {
    selector: '.csn-root',
    map(canonical) {
        const out: Record<string, string> = {};
        for (const [name, value] of Object.entries(canonical)) {
            out[name] = name === '--ord-radius' ? `${value}px` : value;
        }
        return out;
    },
    read(el) {
        const target = el.querySelector<HTMLElement>('.csn-root') ?? el;
        const computed = getComputedStyle(target);
        const result: Record<string, string> = {};
        for (const name of [
            '--ord-background',
            '--ord-foreground',
            '--ord-primary',
            '--ord-muted',
            '--ord-muted-foreground',
            '--ord-card',
            '--ord-border',
            '--ord-code-bg',
            '--ord-code-fg',
        ]) {
            const v = computed.getPropertyValue(name).trim();
            if (v) result[name] = v;
        }
        return result;
    },
};
