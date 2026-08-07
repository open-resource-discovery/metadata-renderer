import type { RendererTheme } from './types';

export interface ThemeTokens {
    background?: string;
    foreground?: string;
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    muted?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
    success?: string;
    successForeground?: string;
    warning?: string;
    warningForeground?: string;
    border?: string;
    input?: string;
    ring?: string;
    card?: string;
    cardForeground?: string;
    popover?: string;
    popoverForeground?: string;
    radius?: string;
}

const TOKEN_MAP: Record<keyof ThemeTokens, string> = {
    background: '--ord-background',
    foreground: '--ord-foreground',
    primary: '--ord-primary',
    primaryForeground: '--ord-primary-foreground',
    secondary: '--ord-secondary',
    secondaryForeground: '--ord-secondary-foreground',
    muted: '--ord-muted',
    mutedForeground: '--ord-muted-foreground',
    accent: '--ord-accent',
    accentForeground: '--ord-accent-foreground',
    destructive: '--ord-destructive',
    destructiveForeground: '--ord-destructive-foreground',
    success: '--ord-success',
    successForeground: '--ord-success-foreground',
    warning: '--ord-warning',
    warningForeground: '--ord-warning-foreground',
    border: '--ord-border',
    input: '--ord-input',
    ring: '--ord-ring',
    card: '--ord-card',
    cardForeground: '--ord-card-foreground',
    popover: '--ord-popover',
    popoverForeground: '--ord-popover-foreground',
    radius: '--ord-radius',
};

export function createTheme(tokens: ThemeTokens): RendererTheme {
    const result: RendererTheme = {};
    for (const [key, value] of Object.entries(tokens)) {
        if (value !== undefined) {
            (result as Record<string, string>)[TOKEN_MAP[key as keyof ThemeTokens]] = value;
        }
    }
    return result;
}
