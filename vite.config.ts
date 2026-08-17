/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
};
// Externalize every declared dep + peer dep in lib mode. Consumers' bundlers
// resolve them; we never bundle a third-party tree (especially Node-flavoured
// ones like @asyncapi/parser that can't run through Vite's browser pipeline).
const libExternals = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    'react/jsx-runtime',
];
const libExternalRegex = new RegExp(
    `^(${libExternals.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(/.*)?$`,
);

export default defineConfig(({ mode }) => {
    const isLib = mode === 'lib';
    const isWatch = process.argv.includes('--watch');

    return {
        test: {
            include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
            environment: 'jsdom',
            globals: true,
        },
        plugins: [
            react(),
            ...(isLib
                ? [
                      ...(isWatch
                          ? []
                          : [
                                dts({
                                    include: ['src/lib/**/*.ts', 'src/lib/**/*.tsx'],
                                    outDir: 'dist',
                                    rollupTypes: false,
                                    tsconfigPath: './tsconfig.app.json',
                                    copyDtsFiles: true,
                                }),
                            ]),
                      //stripUnscopedPreflight(),
                  ]
                : []),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
                '@lib': resolve(__dirname, './src/lib'),
                '@demo': resolve(__dirname, './src/demo'),
            },
        },
        optimizeDeps: isLib ? undefined : {},
        build: isLib
            ? {
                  lib: {
                      entry: {
                          index: resolve(__dirname, 'src/lib/index.ts'),
                          openapi: resolve(__dirname, 'src/lib/entries/openapi.ts'),
                          csn: resolve(__dirname, 'src/lib/entries/csn.ts'),
                          asyncapi: resolve(__dirname, 'src/lib/entries/asyncapi.ts'),
                          overlay: resolve(__dirname, 'src/lib/entries/overlay.ts'),
                          a2a: resolve(__dirname, 'src/lib/entries/a2a.ts'),
                          mcp: resolve(__dirname, 'src/lib/entries/mcp.ts'),
                          // Styles aggregator: bundles every renderer's CSS into
                          // a single dist/index.css (the `./styles` subpath in
                          // package.json). Not externalized: we want the actual
                          // CSS bytes, not import statements.
                          styles: resolve(__dirname, 'src/lib/styles.ts'),
                      },
                      formats: ['es'],
                  },
                  rollupOptions: {
                      // Externalize JS subpaths of declared deps so the lib
                      // doesn't bundle React/Scalar/csn-interop/etc. — but
                      // KEEP CSS subpaths inline (`@pkg/styles`, `*.css`) so
                      // the styles aggregator can produce a single bundled
                      // dist/index.css. CSS-only files don't drag the JS
                      // runtime in, so this stays small.
                      external: (id) => {
                          if (id.endsWith('.css')) return false;
                          if (id.endsWith('/styles')) return false;
                          return libExternalRegex.test(id);
                      },
                      output: {
                          chunkFileNames: 'chunks/[name]-[hash].js',
                          assetFileNames: (assetInfo) => {
                              if (assetInfo.name?.endsWith('.css')) {
                                  return 'index.css';
                              }
                              return '[name][extname]';
                          },
                      },
                  },
                  cssCodeSplit: false,
                  outDir: 'dist',
                  emptyOutDir: !isWatch,
                  // Don't minify the lib output. The consumer's bundler will
                  // minify again, and a previous round of minification leaves
                  // single-letter top-level bindings (e.g. `const A`) that
                  // collide with same-named identifiers in webpack's scope-
                  // hoisting pass, producing TDZ errors like "Cannot access
                  // 'A' before initialization" in the consumer's bundle.
                  minify: false,
              }
            : {
                  outDir: 'dist-demo',
                  emptyOutDir: true,
              },
    };
});
