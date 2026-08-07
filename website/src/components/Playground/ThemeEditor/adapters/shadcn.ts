import { mapShadcnTheme } from '../../../../../../src/lib/core/utils';
import type { ThemeAdapter } from './types';

export const shadcnAdapter: ThemeAdapter = {
    selector: '.mcp-root, .mcp-root.dark, .a2a-root, .a2a-root.dark',
    map(canonical) {
        return mapShadcnTheme(canonical);
    },
    read(el) {
        const computed = getComputedStyle(el);
        const result: Record<string, string> = {};
        for (const name of [
            '--ord-background',
            '--ord-foreground',
            '--ord-primary',
            '--ord-primary-foreground',
            '--ord-card',
            '--ord-card-foreground',
            '--ord-popover',
            '--ord-popover-foreground',
            '--ord-secondary',
            '--ord-secondary-foreground',
            '--ord-muted',
            '--ord-muted-foreground',
            '--ord-accent',
            '--ord-accent-foreground',
            '--ord-destructive',
            '--ord-border',
            '--ord-input',
            '--ord-ring',
            '--ord-sidebar',
            '--ord-sidebar-foreground',
            '--ord-sidebar-primary',
            '--ord-sidebar-primary-foreground',
            '--ord-sidebar-accent',
            '--ord-sidebar-accent-foreground',
            '--ord-sidebar-border',
            '--ord-sidebar-ring',
            '--ord-code-bg',
            '--ord-code-fg',
            '--ord-hljs-attr',
            '--ord-hljs-string',
            '--ord-hljs-number',
            '--ord-hljs-literal',
            '--ord-hljs-punctuation',
            '--ord-hljs-keyword',
            '--ord-hljs-comment',
        ]) {
            const v = computed.getPropertyValue(name).trim();
            if (v) result[name] = v;
        }
        return result;
    },
};
