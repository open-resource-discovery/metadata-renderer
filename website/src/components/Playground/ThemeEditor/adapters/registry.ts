import { csnAdapter } from './csn';
import { scalarAdapter, scalarHljsAdapter, scalarModeAdapter, scalarSidebarAdapter } from './scalar';
import { shadcnAdapter } from './shadcn';
import type { ThemeAdapter } from './types';

export const ADAPTERS: ThemeAdapter[] = [
  shadcnAdapter,
  csnAdapter,
  scalarAdapter,
  scalarSidebarAdapter,
  scalarModeAdapter,
  scalarHljsAdapter,
];
