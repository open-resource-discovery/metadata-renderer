export interface ThemeAdapter {
    selector: string;
    map(canonical: Record<string, string>): Record<string, string>;
    read?(el: HTMLElement): Partial<Record<string, string>>;
}
