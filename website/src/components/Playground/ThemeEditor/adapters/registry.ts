import { scalarAdapter, scalarSidebarAdapter, scalarModeAdapter, scalarHljsAdapter } from './scalar';
import { shadcnAdapter } from './shadcn';
import { csnAdapter } from './csn';
import type { ThemeAdapter } from './types';

export const ADAPTERS: ThemeAdapter[] = [
    shadcnAdapter,
    csnAdapter,
    scalarAdapter,
    scalarSidebarAdapter,
    scalarModeAdapter,
    scalarHljsAdapter,
];
