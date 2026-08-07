interface ThemeAdapter {
    selector: string;
    map(canonical: Record<string, string>): Record<string, string>;
}

const SCALAR_MAP: Record<string, string[]> = {
    '--ord-background': ['--scalar-background-1'],
    '--ord-foreground': ['--scalar-color-1'],
    '--ord-secondary': ['--scalar-background-2'],
    '--ord-secondary-foreground': ['--scalar-color-2'],
    '--ord-muted': ['--scalar-background-3'],
    '--ord-muted-foreground': ['--scalar-color-3'],
    '--ord-primary': [
        '--scalar-color-accent',
        '--scalar-button-1',
        '--scalar-link-color',
        '--scalar-button-1-hover',
        '--scalar-link-color-hover',
    ],
    '--ord-primary-foreground': ['--scalar-button-1-color'],
    '--ord-border': ['--scalar-border-color'],
    '--ord-destructive': ['--scalar-color-red', '--scalar-color-danger'],
    '--ord-success': ['--scalar-color-green'],
    '--ord-warning': ['--scalar-color-orange'],
    '--ord-radius': ['--scalar-radius', '--scalar-radius-lg'],
};

const SCALAR_SIDEBAR_MAP: Record<string, string[]> = {
    '--ord-sidebar': ['--scalar-sidebar-background-1'],
    '--ord-sidebar-foreground': ['--scalar-sidebar-color-1'],
    '--ord-sidebar-primary': ['--scalar-sidebar-background-2'],
    '--ord-sidebar-primary-foreground': ['--scalar-sidebar-color-2', '--scalar-sidebar-search-color'],
    '--ord-sidebar-accent': [
        '--scalar-sidebar-item-active-background',
        '--scalar-sidebar-item-hover-background',
        '--scalar-sidebar-search-background',
    ],
    '--ord-sidebar-accent-foreground': ['--scalar-sidebar-color-active', '--scalar-sidebar-item-hover-color'],
    '--ord-sidebar-border': ['--scalar-sidebar-border-color', '--scalar-sidebar-search-border-color'],
};

function formatValue(name: string, value: string): string {
    if (name === '--ord-radius') return `${value}px`;
    return value;
}

export const scalarAdapter: ThemeAdapter = {
    selector: '.scalar-app',
    map(canonical) {
        const out: Record<string, string> = {};
        for (const [name, value] of Object.entries(canonical)) {
            const targets = SCALAR_MAP[name];
            if (!targets) continue;
            const formatted = formatValue(name, value);
            for (const target of targets) {
                out[target] = formatted;
            }
        }
        return out;
    },
};

export const scalarSidebarAdapter: ThemeAdapter = {
    selector: '.scalar-app .t-doc__sidebar',
    map(canonical) {
        const out: Record<string, string> = {};
        for (const [name, value] of Object.entries(canonical)) {
            const targets = SCALAR_SIDEBAR_MAP[name];
            if (!targets) continue;
            for (const target of targets) {
                out[target] = value;
            }
        }
        return out;
    },
};

// Scalar re-declares many variables inside .dark-mode / .light-mode, which are
// descendants of .scalar-app. A custom property set on a descendant shadows the
// ancestor value, so .scalar-app overrides never reach consuming elements.
// Target both selectors with the same SCALAR_MAP to win via source order.
export const scalarModeAdapter: ThemeAdapter = {
    selector: '.scalar-app .dark-mode, .scalar-app.dark-mode, .scalar-app .light-mode, .scalar-app.light-mode',
    map(canonical) {
        const out: Record<string, string> = {};
        for (const [name, value] of Object.entries(canonical)) {
            const targets = SCALAR_MAP[name];
            if (!targets) continue;
            const formatted = formatValue(name, value);
            for (const target of targets) {
                out[target] = formatted;
            }
        }
        return out;
    },
};

const SCALAR_HLJS_VARS = [
    '--ord-hljs-attr',
    '--ord-hljs-string',
    '--ord-hljs-number',
    '--ord-hljs-function',
    '--ord-hljs-literal',
    '--ord-hljs-punctuation',
    '--ord-hljs-keyword',
    '--ord-hljs-comment',
];

// Forwards --ord-hljs-* onto .scalar-app so that the static hljs CSS overrides
// in styles.ts can resolve var(--ord-hljs-*) inside Scalar's code blocks.
export const scalarHljsAdapter: ThemeAdapter = {
    selector: '.scalar-app',
    map(canonical) {
        const out: Record<string, string> = {};
        for (const name of SCALAR_HLJS_VARS) {
            if (name in canonical) out[name] = canonical[name];
        }
        return out;
    },
};

// Combobox dropdowns and the search modal are teleported out of the
// [data-renderer-id] container to document.body — the combobox into a
// `.scalar-app` wrapper, the search modal into `#headlessui-portal-root` (via
// headless-ui). Scoped overrides never reach them, so they fall back to
// Scalar's own `--scalar-background-1: #fff` declared on `body.light-mode`,
// rendering white in every theme. This adapter re-emits the core token map on
// an UN-scoped selector covering both teleport roots. Its lower specificity
// keeps per-renderer scoped rules winning for in-container content; only the
// body-level popups pick up the fallback.
export const scalarTeleportAdapter: ThemeAdapter = {
    selector: '.scalar-app, #headlessui-portal-root',
    map(canonical) {
        const out: Record<string, string> = {};
        for (const [name, value] of Object.entries(canonical)) {
            const targets = SCALAR_MAP[name];
            if (!targets) continue;
            const formatted = formatValue(name, value);
            for (const target of targets) {
                out[target] = formatted;
            }
        }
        return out;
    },
};

export function buildScalarThemeStyles(id: string, theme: Record<string, string>): string {
    const scope = `[data-renderer-id="${id}"]`;
    const scopedAdapters = [scalarAdapter, scalarSidebarAdapter, scalarModeAdapter, scalarHljsAdapter];

    const scoped = scopedAdapters
        .map((adapter) => {
            const mapped = adapter.map(theme);
            const decls = Object.entries(mapped)
                .map(([k, v]) => `  ${k}: ${v};`)
                .join('\n');
            if (!decls) return '';
            return `${scope} ${adapter.selector} {\n${decls}\n}`;
        })
        .filter(Boolean)
        .join('\n\n');

    // Teleported popups escape the [data-renderer-id] scope — emit their
    // fallback un-scoped (see scalarTeleportAdapter).
    const teleported = (() => {
        const mapped = scalarTeleportAdapter.map(theme);
        const decls = Object.entries(mapped)
            .map(([k, v]) => `  ${k}: ${v};`)
            .join('\n');
        if (!decls) return '';
        return `${scalarTeleportAdapter.selector} {\n${decls}\n}`;
    })();

    return [scoped, teleported].filter(Boolean).join('\n\n');
}
