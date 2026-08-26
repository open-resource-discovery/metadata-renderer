import ErrorBoundary from '@docusaurus/ErrorBoundary';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { forwardRef, lazy, Suspense } from 'react';
import type { MetaType, MetadataRendererOptions, RendererTheme } from '@open-resource-discovery/metadata-renderer';

type Props = {
    file: string;
    type?: MetaType;
    theme?: RendererTheme;
    options?: MetadataRendererOptions;
};

// metadata-renderer is ESM-only ("type": "module"). Using require() would
// force webpack into ESM→CJS interop while scope-hoisting, producing a
// TDZ error ("Cannot access 'PROTOCOL_LABELS' before initialization")
// because module bodies execute in the wrong order. A dynamic import()
// behind React.lazy keeps the module ESM all the way through.
const MetadataRenderer = lazy(async () => {
    await import('@open-resource-discovery/metadata-renderer/styles');
    const [mod, openapi, csn, asyncapi, overlay, a2a, mcp] = await Promise.all([
        import('@open-resource-discovery/metadata-renderer'),
        import('@open-resource-discovery/metadata-renderer/openapi'),
        import('@open-resource-discovery/metadata-renderer/csn'),
        import('@open-resource-discovery/metadata-renderer/asyncapi'),
        import('@open-resource-discovery/metadata-renderer/overlay'),
        import('@open-resource-discovery/metadata-renderer/a2a'),
        import('@open-resource-discovery/metadata-renderer/mcp'),
    ]);
    const renderers = {
        openapi: openapi.OpenApiRenderer,
        csn: csn.CsnRenderer,
        asyncapi: asyncapi.AsyncApiRenderer,
        overlay: overlay.OverlayRenderer,
        a2a: a2a.A2ARenderer,
        mcp: mcp.McpRenderer,
    };
    const Comp = mod.MetadataRenderer;
    return {
        default: (props: Omit<React.ComponentProps<typeof Comp>, 'renderers'>) => (
            <Comp {...props} renderers={renderers} />
        ),
    };
});

const Renderer = forwardRef<HTMLDivElement, Props>(function Renderer({ file, type, theme, options }, ref) {
    return (
        <div ref={ref} className="h-full">
            {file ? (
                <ErrorBoundary fallback={() => <div>Could not render metadata</div>}>
                    <BrowserOnly>
                        {() => (
                            <Suspense fallback={null}>
                                <MetadataRenderer
                                    content={file}
                                    type={type}
                                    className="bg-background"
                                    theme={theme}
                                    options={options}
                                />
                            </Suspense>
                        )}
                    </BrowserOnly>
                </ErrorBoundary>
            ) : null}
        </div>
    );
});

export default Renderer;
