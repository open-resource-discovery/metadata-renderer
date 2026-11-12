import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Scalar's CSS is inlined into our `dist/index.css` while its JS is externalized, so
 * every `@scalar/*` version the consumer resolves must match the version our CSS was
 * inlined from — otherwise the Vue-scoped-style hashes don't match and the layout/search
 * modal silently break (see CLAUDE.md "Scalar version pinning").
 *
 * We declare some `@scalar/*` packages directly AND depend on them transitively through
 * `@scalar/api-reference-react`:
 *   - `@scalar/api-reference` — we import `createApiReference` from it (OpenAPI renderer).
 *   - `@scalar/types`         — we import its config type.
 * That means the version is encoded in two places. This test fails if our direct pin ever
 * drifts from what the wrapper transitively pins, converting the "manual lockstep across
 * two declarations" the review flagged into an enforced one. The Renovate `Scalar` group
 * keeps the common path (bumps) in sync; this test is the backstop if it ever doesn't.
 */

const readPkg = (path: string): { dependencies?: Record<string, string> } => JSON.parse(readFileSync(path, 'utf-8'));

const rootDir = resolve(__dirname, '../../..');
const ourDeps = readPkg(resolve(rootDir, 'package.json')).dependencies ?? {};
const wrapperDeps =
    readPkg(resolve(rootDir, 'node_modules/@scalar/api-reference-react/package.json')).dependencies ?? {};

describe('Scalar version lockstep', () => {
    // Every @scalar/* we declare directly that the wrapper also declares transitively.
    const overlap = Object.keys(ourDeps).filter((name) => name.startsWith('@scalar/') && name in wrapperDeps);

    it('shares at least the known dual-declared packages with the wrapper', () => {
        // Guard against the overlap set silently going empty (e.g. a refactor that drops a
        // dep), which would make the lockstep assertions below vacuously pass.
        expect(overlap).toEqual(expect.arrayContaining(['@scalar/api-reference', '@scalar/types']));
    });

    it.each(['@scalar/api-reference', '@scalar/types'])(
        'pins %s to the same version @scalar/api-reference-react pins transitively',
        (name) => {
            expect(ourDeps[name]).toBe(wrapperDeps[name]);
        },
    );

    it('pins every dual-declared @scalar/* in lockstep with the wrapper', () => {
        const drift = overlap.filter((name) => ourDeps[name] !== wrapperDeps[name]);
        expect(drift).toEqual([]);
    });
});
