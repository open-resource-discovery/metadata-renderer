import { useCallback, useEffect, useState, type JSX, type RefObject } from 'react';
import type { RendererTheme } from '@open-resource-discovery/metadata-renderer';
import { ADAPTERS } from './adapters/registry';
import type { ThemeAdapter } from './adapters/types';
import styles from './themeEditor.module.css';

interface VarDef {
    name: string;
    label: string;
    type: 'color' | 'range';
    min?: number;
    max?: number;
    step?: number;
}

interface Section {
    title: string;
    vars: VarDef[];
}

const SECTIONS: Section[] = [
    {
        title: 'Core Colors',
        vars: [
            { name: '--ord-background', label: 'Background', type: 'color' },
            { name: '--ord-foreground', label: 'Foreground', type: 'color' },
        ],
    },
    {
        title: 'Brand',
        vars: [
            { name: '--ord-primary', label: 'Primary', type: 'color' },
            { name: '--ord-primary-foreground', label: 'Primary Foreground', type: 'color' },
        ],
    },
    {
        title: 'Surfaces',
        vars: [
            { name: '--ord-card', label: 'Card', type: 'color' },
            { name: '--ord-card-foreground', label: 'Card Foreground', type: 'color' },
            { name: '--ord-popover', label: 'Popover', type: 'color' },
            { name: '--ord-popover-foreground', label: 'Popover Foreground', type: 'color' },
        ],
    },
    {
        title: 'UI Colors',
        vars: [
            { name: '--ord-secondary', label: 'Secondary', type: 'color' },
            { name: '--ord-secondary-foreground', label: 'Secondary Foreground', type: 'color' },
            { name: '--ord-muted', label: 'Muted', type: 'color' },
            { name: '--ord-muted-foreground', label: 'Muted Foreground', type: 'color' },
            { name: '--ord-accent', label: 'Accent', type: 'color' },
            { name: '--ord-accent-foreground', label: 'Accent Foreground', type: 'color' },
        ],
    },
    {
        title: 'Semantic',
        vars: [
            { name: '--ord-success', label: 'Success', type: 'color' },
            { name: '--ord-warning', label: 'Warning', type: 'color' },
            { name: '--ord-destructive', label: 'Destructive', type: 'color' },
        ],
    },
    {
        title: 'Borders & Inputs',
        vars: [
            { name: '--ord-border', label: 'Border', type: 'color' },
            { name: '--ord-input', label: 'Input Border', type: 'color' },
            { name: '--ord-ring', label: 'Focus Ring', type: 'color' },
        ],
    },
    {
        title: 'Border Radius',
        vars: [{ name: '--ord-radius', label: 'Radius', type: 'range', min: 0, max: 20, step: 1 }],
    },
    {
        title: 'Sidebar',
        vars: [
            { name: '--ord-sidebar', label: 'Background', type: 'color' },
            { name: '--ord-sidebar-foreground', label: 'Foreground', type: 'color' },
            { name: '--ord-sidebar-primary', label: 'Primary', type: 'color' },
            { name: '--ord-sidebar-primary-foreground', label: 'Primary FG', type: 'color' },
            { name: '--ord-sidebar-accent', label: 'Accent', type: 'color' },
            { name: '--ord-sidebar-accent-foreground', label: 'Accent FG', type: 'color' },
            { name: '--ord-sidebar-border', label: 'Border', type: 'color' },
            { name: '--ord-sidebar-ring', label: 'Ring', type: 'color' },
        ],
    },
    {
        title: 'Code',
        vars: [
            { name: '--ord-code-bg', label: 'Background', type: 'color' },
            { name: '--ord-code-fg', label: 'Foreground', type: 'color' },
        ],
    },
    {
        title: 'Syntax Highlighting',
        vars: [
            { name: '--ord-hljs-attr', label: 'Attribute', type: 'color' },
            { name: '--ord-hljs-string', label: 'String', type: 'color' },
            { name: '--ord-hljs-number', label: 'Number', type: 'color' },
            { name: '--ord-hljs-function', label: 'Function', type: 'color' },
            { name: '--ord-hljs-literal', label: 'Literal', type: 'color' },
            { name: '--ord-hljs-punctuation', label: 'Punctuation', type: 'color' },
            { name: '--ord-hljs-keyword', label: 'Keyword', type: 'color' },
            { name: '--ord-hljs-comment', label: 'Comment', type: 'color' },
        ],
    },
];

const COMPONENT_TOKEN_GROUPS: Array<{ component: string; tokens: string[] }> = [
    {
        component: 'Card',
        tokens: ['--ord-card-bg', '--ord-card-fg', '--ord-card-border'],
    },
    {
        component: 'Button',
        tokens: [
            '--ord-button-primary-bg',
            '--ord-button-primary-fg',
            '--ord-button-primary-bg-hover',
            '--ord-button-primary-bg-active',
            '--ord-button-secondary-bg',
            '--ord-button-secondary-fg',
            '--ord-button-secondary-bg-hover',
            '--ord-button-destructive-bg',
            '--ord-button-destructive-fg',
            '--ord-button-destructive-bg-hover',
            '--ord-button-outline-border',
            '--ord-button-outline-bg',
            '--ord-button-outline-bg-hover',
            '--ord-button-outline-fg-hover',
            '--ord-button-ghost-bg-hover',
            '--ord-button-ghost-fg-hover',
            '--ord-button-link-fg',
        ],
    },
    {
        component: 'Badge',
        tokens: [
            '--ord-badge-default-bg',
            '--ord-badge-default-fg',
            '--ord-badge-secondary-bg',
            '--ord-badge-secondary-fg',
            '--ord-badge-destructive-bg',
            '--ord-badge-destructive-fg',
            '--ord-badge-success-bg',
            '--ord-badge-success-fg',
            '--ord-badge-warning-bg',
            '--ord-badge-warning-fg',
            '--ord-badge-outline-border',
            '--ord-badge-outline-fg',
            '--ord-badge-highlight-bg',
            '--ord-badge-highlight-fg',
            '--ord-badge-highlight-border',
        ],
    },
    {
        component: 'Input',
        tokens: ['--ord-input-bg', '--ord-input-fg', '--ord-input-border', '--ord-input-placeholder'],
    },
    {
        component: 'Tabs',
        tokens: ['--ord-tabs-fg', '--ord-tabs-active-bg', '--ord-tabs-active-fg', '--ord-tabs-indicator'],
    },
    {
        component: 'Tooltip',
        tokens: ['--ord-tooltip-bg', '--ord-tooltip-fg'],
    },
    {
        component: 'Dialog',
        tokens: [
            '--ord-dialog-backdrop',
            '--ord-dialog-bg',
            '--ord-dialog-fg',
            '--ord-dialog-border',
            '--ord-dialog-description-fg',
        ],
    },
    {
        component: 'Sheet',
        tokens: [
            '--ord-sheet-backdrop',
            '--ord-sheet-bg',
            '--ord-sheet-fg',
            '--ord-sheet-border',
            '--ord-sheet-description-fg',
        ],
    },
    {
        component: 'Combobox',
        tokens: [
            '--ord-combobox-popup-bg',
            '--ord-combobox-popup-fg',
            '--ord-combobox-popup-border',
            '--ord-combobox-item-bg-hover',
            '--ord-combobox-item-fg-hover',
        ],
    },
    {
        component: 'Select',
        tokens: [
            '--ord-select-trigger-bg',
            '--ord-select-trigger-fg',
            '--ord-select-trigger-border',
            '--ord-select-popup-bg',
            '--ord-select-popup-fg',
            '--ord-select-popup-border',
            '--ord-select-item-bg-hover',
            '--ord-select-item-fg-hover',
        ],
    },
    {
        component: 'Switch',
        tokens: ['--ord-switch-track-on', '--ord-switch-track-off', '--ord-switch-thumb'],
    },
    {
        component: 'Checkbox',
        tokens: ['--ord-checkbox-border', '--ord-checkbox-bg-checked', '--ord-checkbox-fg-checked'],
    },
    {
        component: 'Progress',
        tokens: ['--ord-progress-track', '--ord-progress-indicator'],
    },
    {
        component: 'Spinner',
        tokens: ['--ord-spinner-fg'],
    },
    {
        component: 'Avatar',
        tokens: ['--ord-avatar-fallback-bg', '--ord-avatar-fallback-fg'],
    },
];

// Maps each component token to the semantic --ord-* token it inherits from by default.
// Derived from the .ord-ui fallback chain in ui-components.css.
const COMPONENT_FALLBACKS: Record<string, string> = {
    '--ord-card-bg': '--ord-card',
    '--ord-card-fg': '--ord-card-foreground',
    '--ord-card-border': '--ord-border',
    '--ord-button-primary-bg': '--ord-primary',
    '--ord-button-primary-fg': '--ord-primary-foreground',
    '--ord-button-primary-bg-hover': '--ord-primary',
    '--ord-button-primary-bg-active': '--ord-primary',
    '--ord-button-secondary-bg': '--ord-secondary',
    '--ord-button-secondary-fg': '--ord-secondary-foreground',
    '--ord-button-secondary-bg-hover': '--ord-secondary',
    '--ord-button-destructive-bg': '--ord-destructive',
    '--ord-button-destructive-fg': '--ord-foreground',
    '--ord-button-destructive-bg-hover': '--ord-destructive',
    '--ord-button-outline-border': '--ord-input',
    '--ord-button-outline-bg': '--ord-background',
    '--ord-button-outline-bg-hover': '--ord-accent',
    '--ord-button-outline-fg-hover': '--ord-accent-foreground',
    '--ord-button-ghost-bg-hover': '--ord-accent',
    '--ord-button-ghost-fg-hover': '--ord-accent-foreground',
    '--ord-button-link-fg': '--ord-primary',
    '--ord-badge-default-bg': '--ord-primary',
    '--ord-badge-default-fg': '--ord-primary-foreground',
    '--ord-badge-secondary-bg': '--ord-secondary',
    '--ord-badge-secondary-fg': '--ord-secondary-foreground',
    '--ord-badge-destructive-bg': '--ord-destructive',
    '--ord-badge-destructive-fg': '--ord-foreground',
    '--ord-badge-success-bg': '--ord-primary',
    '--ord-badge-success-fg': '--ord-primary-foreground',
    '--ord-badge-warning-bg': '--ord-accent',
    '--ord-badge-warning-fg': '--ord-accent-foreground',
    '--ord-badge-outline-border': '--ord-border',
    '--ord-badge-outline-fg': '--ord-foreground',
    '--ord-badge-highlight-bg': '--ord-primary',
    '--ord-badge-highlight-fg': '--ord-primary',
    '--ord-badge-highlight-border': '--ord-primary',
    '--ord-input-bg': '--ord-background',
    '--ord-input-fg': '--ord-foreground',
    '--ord-input-border': '--ord-input',
    '--ord-input-placeholder': '--ord-muted-foreground',
    '--ord-tabs-fg': '--ord-muted-foreground',
    '--ord-tabs-active-bg': '--ord-muted',
    '--ord-tabs-active-fg': '--ord-foreground',
    '--ord-tabs-indicator': '--ord-primary',
    '--ord-tooltip-bg': '--ord-foreground',
    '--ord-tooltip-fg': '--ord-background',
    '--ord-dialog-backdrop': '--ord-foreground',
    '--ord-dialog-bg': '--ord-card',
    '--ord-dialog-fg': '--ord-card-foreground',
    '--ord-dialog-border': '--ord-border',
    '--ord-dialog-description-fg': '--ord-muted-foreground',
    '--ord-sheet-backdrop': '--ord-foreground',
    '--ord-sheet-bg': '--ord-card',
    '--ord-sheet-fg': '--ord-card-foreground',
    '--ord-sheet-border': '--ord-border',
    '--ord-sheet-description-fg': '--ord-muted-foreground',
    '--ord-combobox-popup-bg': '--ord-popover',
    '--ord-combobox-popup-fg': '--ord-popover-foreground',
    '--ord-combobox-popup-border': '--ord-border',
    '--ord-combobox-item-bg-hover': '--ord-accent',
    '--ord-combobox-item-fg-hover': '--ord-accent-foreground',
    '--ord-select-trigger-bg': '--ord-background',
    '--ord-select-trigger-fg': '--ord-foreground',
    '--ord-select-trigger-border': '--ord-input',
    '--ord-select-popup-bg': '--ord-popover',
    '--ord-select-popup-fg': '--ord-popover-foreground',
    '--ord-select-popup-border': '--ord-border',
    '--ord-select-item-bg-hover': '--ord-accent',
    '--ord-select-item-fg-hover': '--ord-accent-foreground',
    '--ord-switch-track-on': '--ord-primary',
    '--ord-switch-track-off': '--ord-input',
    '--ord-switch-thumb': '--ord-background',
    '--ord-checkbox-border': '--ord-primary',
    '--ord-checkbox-bg-checked': '--ord-primary',
    '--ord-checkbox-fg-checked': '--ord-primary-foreground',
    '--ord-progress-track': '--ord-secondary',
    '--ord-progress-indicator': '--ord-primary',
    '--ord-spinner-fg': '--ord-primary',
    '--ord-avatar-fallback-bg': '--ord-muted',
    '--ord-avatar-fallback-fg': '--ord-muted-foreground',
};

const ALL_VARS = SECTIONS.flatMap((s) => s.vars.map((v) => v.name));
const ALL_COMPONENT_VARS = COMPONENT_TOKEN_GROUPS.flatMap((g) => g.tokens);
const KNOWN_VARS = new Set([...ALL_VARS, ...ALL_COMPONENT_VARS]);

interface Preset {
    label: string;
    mode: 'dark' | 'light';
    values: Record<string, string>;
}

const PRESETS: Preset[] = [
    {
        label: 'Default Dark',
        mode: 'dark',
        values: {
            '--ord-background': '#1e1e1e',
            '--ord-foreground': '#d4d4d4',
            '--ord-card': '#252526',
            '--ord-card-foreground': '#d4d4d4',
            '--ord-popover': '#252526',
            '--ord-popover-foreground': '#d4d4d4',
            '--ord-primary': '#0098ff',
            '--ord-primary-foreground': '#1e1e1e',
            '--ord-secondary': '#2a2d32',
            '--ord-secondary-foreground': '#d4d4d4',
            '--ord-muted': '#323843',
            '--ord-muted-foreground': '#969696',
            '--ord-accent': '#3c475d',
            '--ord-accent-foreground': '#bebedf',
            '--ord-destructive': '#f44747',
            '--ord-success': '#27e0d1',
            '--ord-warning': '#ff9800',
            '--ord-border': '#3e3e42',
            '--ord-input': '#3e3e42',
            '--ord-ring': '#0098ff',
            '--ord-sidebar': '#252526',
            '--ord-sidebar-foreground': '#d4d4d4',
            '--ord-sidebar-primary': '#0098ff',
            '--ord-sidebar-primary-foreground': '#d4d4d4',
            '--ord-sidebar-accent': '#3c475d',
            '--ord-sidebar-accent-foreground': '#d4d4d4',
            '--ord-sidebar-border': '#3e3e42',
            '--ord-sidebar-ring': '#0098ff',
            '--ord-radius': '10',
            '--ord-code-bg': '#2d2d30',
            '--ord-code-fg': '#969696',
            '--ord-hljs-attr': '#9cdcfe',
            '--ord-hljs-string': '#ce9178',
            '--ord-hljs-number': '#b5cea8',
            '--ord-hljs-function': '#dcdcaa',
            '--ord-hljs-literal': '#569cd6',
            '--ord-hljs-punctuation': '#d4d4d4',
            '--ord-hljs-keyword': '#569cd6',
            '--ord-hljs-comment': '#6a9955',
        },
    },
    {
        label: 'Default Light',
        mode: 'light',
        values: {
            '--ord-background': '#ffffff',
            '--ord-foreground': '#1a1a2e',
            '--ord-card': '#ffffff',
            '--ord-card-foreground': '#1a1a2e',
            '--ord-popover': '#ffffff',
            '--ord-popover-foreground': '#1a1a2e',
            '--ord-primary': '#0b3b84',
            '--ord-primary-foreground': '#fafafa',
            '--ord-secondary': '#f0f2f4',
            '--ord-secondary-foreground': '#1a1a2e',
            '--ord-muted': '#e0e4eb',
            '--ord-muted-foreground': '#71717a',
            '--ord-accent': '#cdd5e5',
            '--ord-accent-foreground': '#8b8bb6',
            '--ord-destructive': '#dc2626',
            '--ord-success': '#4a9696',
            '--ord-warning': '#f59e0b',
            '--ord-border': '#e4e4e7',
            '--ord-input': '#e4e4e7',
            '--ord-ring': '#a1a1aa',
            '--ord-sidebar': '#fafafa',
            '--ord-sidebar-foreground': '#1a1a2e',
            '--ord-sidebar-primary': '#fafafa',
            '--ord-sidebar-primary-foreground': '#1a1a2e',
            '--ord-sidebar-accent': '#cdd5e5',
            '--ord-sidebar-accent-foreground': '#1a1a2e',
            '--ord-sidebar-border': '#e4e4e7',
            '--ord-sidebar-ring': '#a1a1aa',
            '--ord-radius': '10',
            '--ord-code-bg': '#f4f4f5',
            '--ord-code-fg': '#71717a',
            '--ord-hljs-attr': '#881391',
            '--ord-hljs-string': '#a31515',
            '--ord-hljs-number': '#098658',
            '--ord-hljs-function': '#795e26',
            '--ord-hljs-literal': '#0000ff',
            '--ord-hljs-punctuation': '#000000',
            '--ord-hljs-keyword': '#0000ff',
            '--ord-hljs-comment': '#008000',
        },
    },
    {
        label: 'Ocean',
        mode: 'dark',
        values: {
            '--ord-background': '#0b1929',
            '--ord-foreground': '#b2ccd6',
            '--ord-card': '#0d2137',
            '--ord-card-foreground': '#b2ccd6',
            '--ord-popover': '#0d2137',
            '--ord-popover-foreground': '#b2ccd6',
            '--ord-primary': '#00bcd4',
            '--ord-primary-foreground': '#0b1929',
            '--ord-secondary': '#192e43',
            '--ord-secondary-foreground': '#b2ccd6',
            '--ord-muted': '#253d56',
            '--ord-muted-foreground': '#6b8a9e',
            '--ord-accent': '#224d77',
            '--ord-accent-foreground': '#b2ccd6',
            '--ord-destructive': '#ff6b6b',
            '--ord-success': '#1d7759',
            '--ord-warning': '#ddae03',
            '--ord-border': '#1e3a5f',
            '--ord-input': '#1e3a5f',
            '--ord-ring': '#00bcd4',
            '--ord-sidebar': '#0d2137',
            '--ord-sidebar-foreground': '#b2ccd6',
            '--ord-sidebar-primary': '#00bcd4',
            '--ord-sidebar-primary-foreground': '#b2ccd6',
            '--ord-sidebar-accent': '#224d77',
            '--ord-sidebar-accent-foreground': '#b2ccd6',
            '--ord-sidebar-border': '#1e3a5f',
            '--ord-sidebar-ring': '#00bcd4',
            '--ord-radius': '8',
            '--ord-code-bg': '#132f4c',
            '--ord-code-fg': '#6b8a9e',
            '--ord-hljs-attr': '#80cbc4',
            '--ord-hljs-string': '#c3e88d',
            '--ord-hljs-number': '#f78c6c',
            '--ord-hljs-function': '#82aaff',
            '--ord-hljs-literal': '#89ddff',
            '--ord-hljs-punctuation': '#b2ccd6',
            '--ord-hljs-keyword': '#c792ea',
            '--ord-hljs-comment': '#546e7a',
        },
    },
    {
        label: 'Forest',
        mode: 'dark',
        values: {
            '--ord-background': '#1a2e1a',
            '--ord-foreground': '#c8d6c0',
            '--ord-card': '#223322',
            '--ord-card-foreground': '#c8d6c0',
            '--ord-popover': '#223322',
            '--ord-popover-foreground': '#c8d6c0',
            '--ord-primary': '#4caf50',
            '--ord-primary-foreground': '#1a2e1a',
            '--ord-secondary': '#2c492d',
            '--ord-secondary-foreground': '#c8d6c0',
            '--ord-muted': '#39563a',
            '--ord-muted-foreground': '#7fa07a',
            '--ord-accent': '#377239',
            '--ord-accent-foreground': '#c8d6c0',
            '--ord-destructive': '#e57373',
            '--ord-success': '#266e68',
            '--ord-warning': '#dda303',
            '--ord-border': '#3d5c3d',
            '--ord-input': '#3d5c3d',
            '--ord-ring': '#4caf50',
            '--ord-sidebar': '#223322',
            '--ord-sidebar-foreground': '#c8d6c0',
            '--ord-sidebar-primary': '#4caf50',
            '--ord-sidebar-primary-foreground': '#c8d6c0',
            '--ord-sidebar-accent': '#377239',
            '--ord-sidebar-accent-foreground': '#c8d6c0',
            '--ord-sidebar-border': '#3d5c3d',
            '--ord-sidebar-ring': '#4caf50',
            '--ord-radius': '12',
            '--ord-code-bg': '#2d4a2d',
            '--ord-code-fg': '#7fa07a',
            '--ord-hljs-attr': '#a5d6a7',
            '--ord-hljs-string': '#ffe082',
            '--ord-hljs-number': '#ffcc80',
            '--ord-hljs-function': '#e6db74',
            '--ord-hljs-literal': '#81c784',
            '--ord-hljs-punctuation': '#c8d6c0',
            '--ord-hljs-keyword': '#aed581',
            '--ord-hljs-comment': '#6b8e6b',
        },
    },
    {
        label: 'Rose',
        mode: 'dark',
        values: {
            '--ord-background': '#1c1017',
            '--ord-foreground': '#e8d5dc',
            '--ord-card': '#271520',
            '--ord-card-foreground': '#e8d5dc',
            '--ord-popover': '#271520',
            '--ord-popover-foreground': '#e8d5dc',
            '--ord-primary': '#f472b6',
            '--ord-primary-foreground': '#1c1017',
            '--ord-secondary': '#3d1f2f',
            '--ord-secondary-foreground': '#e8d5dc',
            '--ord-muted': '#4b2a3c',
            '--ord-muted-foreground': '#a07888',
            '--ord-accent': '#68274a',
            '--ord-accent-foreground': '#e8d5dc',
            '--ord-destructive': '#fb7185',
            '--ord-success': '#217d27',
            '--ord-warning': '#cf7f07',
            '--ord-border': '#4d2a3c',
            '--ord-input': '#4d2a3c',
            '--ord-ring': '#f472b6',
            '--ord-sidebar': '#271520',
            '--ord-sidebar-foreground': '#e8d5dc',
            '--ord-sidebar-primary': '#f472b6',
            '--ord-sidebar-primary-foreground': '#e8d5dc',
            '--ord-sidebar-accent': '#68274a',
            '--ord-sidebar-accent-foreground': '#e8d5dc',
            '--ord-sidebar-border': '#4d2a3c',
            '--ord-sidebar-ring': '#f472b6',
            '--ord-radius': '14',
            '--ord-code-bg': '#3d1f30',
            '--ord-code-fg': '#a07888',
            '--ord-hljs-attr': '#fda4af',
            '--ord-hljs-string': '#fcd34d',
            '--ord-hljs-number': '#fdba74',
            '--ord-hljs-function': '#fde68a',
            '--ord-hljs-literal': '#f9a8d4',
            '--ord-hljs-punctuation': '#e8d5dc',
            '--ord-hljs-keyword': '#c4b5fd',
            '--ord-hljs-comment': '#7a5568',
        },
    },
    {
        label: 'Monochrome',
        mode: 'dark',
        values: {
            '--ord-background': '#171717',
            '--ord-foreground': '#d4d4d4',
            '--ord-card': '#212121',
            '--ord-card-foreground': '#d4d4d4',
            '--ord-popover': '#212121',
            '--ord-popover-foreground': '#d4d4d4',
            '--ord-primary': '#e0e0e0',
            '--ord-primary-foreground': '#171717',
            '--ord-secondary': '#292929',
            '--ord-secondary-foreground': '#d4d4d4',
            '--ord-muted': '#333333',
            '--ord-muted-foreground': '#808080',
            '--ord-accent': '#3d3d3d',
            '--ord-accent-foreground': '#a8a8a8',
            '--ord-destructive': '#d4d4d4',
            '--ord-success': '#c3c3c3',
            '--ord-warning': '#eaeaea',
            '--ord-border': '#404040',
            '--ord-input': '#404040',
            '--ord-ring': '#a0a0a0',
            '--ord-sidebar': '#212121',
            '--ord-sidebar-foreground': '#d4d4d4',
            '--ord-sidebar-primary': '#e0e0e0',
            '--ord-sidebar-primary-foreground': '#d4d4d4',
            '--ord-sidebar-accent': '#3d3d3d',
            '--ord-sidebar-accent-foreground': '#d4d4d4',
            '--ord-sidebar-border': '#404040',
            '--ord-sidebar-ring': '#a0a0a0',
            '--ord-radius': '6',
            '--ord-code-bg': '#2a2a2a',
            '--ord-code-fg': '#808080',
            '--ord-hljs-attr': '#b0b0b0',
            '--ord-hljs-string': '#a0a0a0',
            '--ord-hljs-number': '#c0c0c0',
            '--ord-hljs-function': '#e8e8e8',
            '--ord-hljs-literal': '#d0d0d0',
            '--ord-hljs-punctuation': '#909090',
            '--ord-hljs-keyword': '#e0e0e0',
            '--ord-hljs-comment': '#606060',
        },
    },
];

function oklchToHex(value: string): string {
    if (value.startsWith('oklch(')) {
        try {
            const el = document.createElement('div');
            el.style.color = value;
            document.body.appendChild(el);
            const computed = getComputedStyle(el).color;
            document.body.removeChild(el);
            const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const [, r, g, b] = match;
                return `#${[r, g, b].map((c) => Number(c).toString(16).padStart(2, '0')).join('')}`;
            }
        } catch {
            // ignore
        }
    }
    if (value.startsWith('#')) {
        return value.length === 4 ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}` : value;
    }
    return value;
}

function ColorControl({
    def,
    value,
    onChange,
}: {
    def: VarDef;
    value: string;
    onChange: (name: string, value: string) => void;
}): JSX.Element {
    return (
        <div className={styles.control}>
            <label className={styles.label}>{def.label}</label>
            <div className={styles.colorRow}>
                <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
                    onChange={(e) => onChange(def.name, e.target.value)}
                    className={styles.colorInput}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(def.name, v);
                    }}
                    className={styles.hexInput}
                    spellCheck={false}
                />
            </div>
        </div>
    );
}

function RangeControl({
    def,
    value,
    onChange,
}: {
    def: VarDef;
    value: string;
    onChange: (name: string, value: string) => void;
}): JSX.Element {
    const numVal = parseInt(value, 10) || 0;
    return (
        <div className={styles.control}>
            <label className={styles.label}>
                {def.label}: {numVal}px
            </label>
            <input
                type="range"
                min={def.min ?? 0}
                max={def.max ?? 20}
                step={def.step ?? 1}
                value={numVal}
                onChange={(e) => onChange(def.name, e.target.value)}
                className={styles.rangeInput}
            />
        </div>
    );
}

function ComponentColorControl({
    token,
    value,
    fallback,
    onChange,
    onClear,
}: {
    token: string;
    value: string;
    fallback: string;
    onChange: (v: string) => void;
    onClear: () => void;
}): JSX.Element {
    const label = token.replace('--ord-', '').replace(/-/g, ' ');
    const isSet = Boolean(value);
    const displayValue = isSet ? value : fallback;
    return (
        <div className={styles.componentRow}>
            <div className={styles.control}>
                <label className={`${styles.label}${isSet ? '' : ` ${styles.labelInherited}`}`}>{label}</label>
                <div className={styles.colorRow}>
                    <input
                        type="color"
                        value={/^#[0-9a-fA-F]{6}$/.test(displayValue) ? displayValue : '#000000'}
                        onChange={(e) => onChange(e.target.value)}
                        className={styles.colorInput}
                    />
                    <input
                        type="text"
                        value={value}
                        placeholder={fallback || '#000000'}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (v === '') onClear();
                            else if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
                        }}
                        className={styles.hexInput}
                        spellCheck={false}
                    />
                </div>
            </div>
            {isSet && (
                <button type="button" onClick={onClear} className={styles.clearBtn} aria-label={`Clear ${token}`}>
                    ✕
                </button>
            )}
        </div>
    );
}

type Props = {
    target?: RefObject<HTMLDivElement>;
    onThemeChange: (theme: RendererTheme) => void;
    file?: string;
    onClose?: () => void;
};

interface AdapterMatch {
    adapter: ThemeAdapter;
    scopes: HTMLElement[];
}

function findAdapterMatches(wrapper: HTMLElement): AdapterMatch[] {
    const matches: AdapterMatch[] = [];
    for (const adapter of ADAPTERS) {
        // Search inside wrapper, but also check wrapper itself and fall back to document
        const candidates: HTMLElement[] = [...Array.from(wrapper.querySelectorAll<HTMLElement>(adapter.selector))];
        if (wrapper.matches?.(adapter.selector)) candidates.unshift(wrapper);
        if (candidates.length === 0) {
            const fromDoc = Array.from(document.querySelectorAll<HTMLElement>(adapter.selector));
            candidates.push(...fromDoc);
        }
        if (candidates.length === 0) continue;
        // Deduplicate
        const unique = [...new Set(candidates)];
        matches.push({ adapter, scopes: unique });
    }
    return matches;
}

function getDefaultPreset(): Preset {
    if (typeof window === 'undefined') return PRESETS[0];
    const docTheme = document.documentElement.getAttribute('data-theme');
    const isDark =
        docTheme === 'dark' || (docTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const label = isDark ? 'Default Dark' : 'Default Light';
    return PRESETS.find((p) => p.label === label) ?? PRESETS[0];
}

export default function ThemeEditor({ target, onThemeChange, file: _file, onClose }: Props): JSX.Element {
    const [overrides, setOverrides] = useState<Record<string, string>>(() => getDefaultPreset().values);
    const [componentColors, setComponentColors] = useState<Record<string, string>>({});
    const [activePreset, setActivePreset] = useState(() => getDefaultPreset().label);
    const [showExport, setShowExport] = useState(false);
    const [importText, setImportText] = useState('');
    const [importNote, setImportNote] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const merged: RendererTheme = { ...overrides, ...componentColors };
        onThemeChange(merged);
    }, [overrides, componentColors, onThemeChange]);

    const handleChange = useCallback((name: string, value: string) => {
        setOverrides((prev) => ({ ...prev, [name]: value }));
        setActivePreset('');
    }, []);

    const setComponentColor = useCallback((k: string, v: string) => {
        setComponentColors((prev) => ({ ...prev, [k]: v }));
    }, []);

    const clearComponentColor = useCallback((k: string) => {
        setComponentColors((prev) => {
            const next = { ...prev };
            delete next[k];
            return next;
        });
    }, []);

    const applyPreset = useCallback((label: string) => {
        const preset = PRESETS.find((p) => p.label === label);
        if (!preset) return;
        setActivePreset(label);
        setOverrides(preset.values);
    }, []);

    const resetAll = useCallback(() => {
        const preset = getDefaultPreset();
        setActivePreset(preset.label);
        setOverrides(preset.values);
        setComponentColors({});
    }, []);

    const exportTheme = useCallback(() => {
        const merged = { ...overrides, ...componentColors };
        const lines = Object.entries(merged)
            .filter(([, v]) => v)
            .map(([k, v]) => `  '${k}': '${v}',`);
        return `{\n${lines.join('\n')}\n}`;
    }, [overrides, componentColors]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(exportTheme()).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [exportTheme]);

    const handleImport = useCallback(() => {
        const re = /['"]?(--ord-[a-z0-9-]+)['"]?\s*:\s*['"]([^'"]+)['"]/gi;
        const nextOverrides: Record<string, string> = {};
        const nextComponents: Record<string, string> = {};
        let match: RegExpExecArray | null;
        while ((match = re.exec(importText)) !== null) {
            const name = match[1];
            if (!KNOWN_VARS.has(name)) continue;
            const raw = match[2].trim();
            if (ALL_COMPONENT_VARS.includes(name)) {
                nextComponents[name] = raw;
            } else if (name === '--ord-radius') {
                nextOverrides[name] = raw.replace(/px$/i, '').trim();
            } else {
                nextOverrides[name] = raw;
            }
        }
        const count = Object.keys(nextOverrides).length + Object.keys(nextComponents).length;
        if (count === 0) {
            setImportNote('No matching variables found.');
            return;
        }
        if (Object.keys(nextOverrides).length > 0) {
            setOverrides((prev) => ({ ...prev, ...nextOverrides }));
            setActivePreset('');
        }
        if (Object.keys(nextComponents).length > 0) {
            setComponentColors((prev) => ({ ...prev, ...nextComponents }));
        }
        setImportNote(`Imported ${count} variable${count === 1 ? '' : 's'}.`);
    }, [importText]);

    const initFromTarget = useCallback(() => {
        const wrapper = target?.current;
        if (!wrapper) return;
        setOverrides({});
        setComponentColors({});
        const matches = findAdapterMatches(wrapper);
        const readable = matches.find((m) => m.adapter.read && m.scopes.length > 0);
        if (!readable || !readable.adapter.read) return;
        const native = readable.adapter.read(readable.scopes[0]);
        const fresh: Record<string, string> = {};
        for (const name of ALL_VARS) {
            if (name === '--ord-radius') {
                fresh[name] = '10';
                continue;
            }
            const raw = native[name];
            fresh[name] = raw ? oklchToHex(raw) : '#000000';
        }
        setOverrides(fresh);
        setComponentColors({});
        setActivePreset('');
    }, [target]);

    return (
        <div className={styles.sidebar}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h2 className={styles.title}>Theme Editor</h2>
                    <p className={styles.subtitle}>Customize CSS variables and see changes live.</p>
                </div>
                {onClose && (
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close theme editor">
                        ✕
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <select value={activePreset} onChange={(e) => applyPreset(e.target.value)} className={styles.select}>
                    <option value="" disabled>
                        Select preset...
                    </option>
                    {PRESETS.map((p) => (
                        <option key={p.label} value={p.label}>
                            {p.label}
                        </option>
                    ))}
                </select>
                <div className={styles.btnRow}>
                    <button
                        onClick={initFromTarget}
                        className={styles.btn}
                        title="Reload from current rendered defaults"
                    >
                        Sync
                    </button>
                    <button onClick={resetAll} className={styles.btn}>
                        Reset
                    </button>
                    <button onClick={() => setShowExport((v) => !v)} className={`${styles.btn} ${styles.btnPrimary}`}>
                        {showExport ? 'Hide' : 'Import/Export'}
                    </button>
                </div>
            </div>

            {/* Export / Import */}
            {showExport && (
                <div className={styles.export}>
                    <div className={styles.exportHeader}>
                        <span className={styles.exportTitle}>Theme object</span>
                        <button onClick={handleCopy} className={`${styles.btn} ${styles.btnSm}`}>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <textarea className={styles.exportCode} readOnly value={exportTheme()} rows={10} />

                    <div className={styles.exportHeader}>
                        <span className={styles.exportTitle}>Import theme</span>
                        <button onClick={handleImport} className={`${styles.btn} ${styles.btnSm}`}>
                            Apply
                        </button>
                    </div>
                    <textarea
                        className={styles.exportCode}
                        value={importText}
                        onChange={(e) => {
                            setImportText(e.target.value);
                            setImportNote(null);
                        }}
                        placeholder="{ '--ord-primary': '#ff0000', '--ord-radius': '12' }"
                        rows={6}
                        spellCheck={false}
                    />
                    {importNote && <div className={styles.importNote}>{importNote}</div>}
                </div>
            )}

            {/* Scrollable sections */}
            <div className={styles.sections}>
                {SECTIONS.map((section) => (
                    <details key={section.title} open>
                        <summary className={styles.sectionTitle}>{section.title}</summary>
                        <div className={styles.sectionBody}>
                            {section.vars.map((def) =>
                                def.type === 'color' ? (
                                    <ColorControl
                                        key={def.name}
                                        def={def}
                                        value={overrides[def.name] || '#000000'}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <RangeControl
                                        key={def.name}
                                        def={def}
                                        value={overrides[def.name] || '10'}
                                        onChange={handleChange}
                                    />
                                ),
                            )}
                        </div>
                    </details>
                ))}

                {/* Component Overrides */}
                <details className={styles.componentOverridesSection}>
                    <summary className={styles.sectionTitle}>
                        Component overrides (advanced)
                        {Object.values(componentColors).some(Boolean) && (
                            <span className={styles.activeIndicator}>●</span>
                        )}
                    </summary>
                    <p className={styles.componentOverridesHint}>
                        Each token defaults to its semantic source. Set a value to override only that component.
                    </p>
                    <div className={styles.componentGroups}>
                        {COMPONENT_TOKEN_GROUPS.map((group) => {
                            const groupActive = group.tokens.some((t) => componentColors[t]);
                            return (
                                <details key={group.component} className={styles.componentGroup}>
                                    <summary className={styles.componentGroupHeader}>
                                        {group.component}
                                        {groupActive && <span className={styles.groupActiveDot}>●</span>}
                                    </summary>
                                    <div className={styles.componentGroupBody}>
                                        {group.tokens.map((token) => {
                                            const semanticToken = COMPONENT_FALLBACKS[token];
                                            const fallback = semanticToken ? (overrides[semanticToken] ?? '') : '';
                                            return (
                                                <ComponentColorControl
                                                    key={token}
                                                    token={token}
                                                    value={componentColors[token] ?? ''}
                                                    fallback={fallback}
                                                    onChange={(v) => setComponentColor(token, v)}
                                                    onClear={() => clearComponentColor(token)}
                                                />
                                            );
                                        })}
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                </details>
            </div>
        </div>
    );
}
