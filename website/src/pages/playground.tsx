import Layout from '@theme/Layout';
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels';
import {
    detectMetaType,
    type MetaType,
    type MetadataRendererOptions,
    type RendererTheme,
} from '@open-resource-discovery/metadata-renderer';
import styles from './playground.module.css';
import EditorComponent, {
    type MetaTypeChoice,
    type EditorHandle,
} from '@site/src/components/Playground/editorComponent';
import Renderer from '@site/src/components/Playground/renderer';
import ThemeEditor from '@site/src/components/Playground/ThemeEditor';
import PlaygroundToolbar from '@site/src/components/Playground/PlaygroundToolbar';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { FileFormats } from '@site/src/components/Playground/example';

const OptionsEditor = lazy(() => import('@site/src/components/Playground/OptionsEditor'));

export default function Playground() {
    const [file, setFile] = useState<string>('');
    const [metaTypeOverride, setMetaTypeOverride] = useState<MetaTypeChoice>('auto');
    const [autoDetect, setAutoDetect] = useState(true);
    const [strictTypeCheck, setStrictTypeCheck] = useState(true);
    const [rendererTheme, setRendererTheme] = useState<RendererTheme | undefined>(undefined);
    const [rendererOptions, setRendererOptions] = useState<MetadataRendererOptions>({});
    const [fileFormat, setFileFormat] = useState<FileFormats>('json');
    const [isEmpty, setIsEmpty] = useState(true);
    const editorRef = useRef<EditorHandle>(null);

    function handleMetaTypeChange(t: MetaTypeChoice) {
        setMetaTypeOverride(t);
        const next = t !== 'auto';
        setAutoDetect(!next);
        setRendererOptions((prev) => ({ ...prev, autoDetect: !next }));
    }

    function handleAutoDetectChange(v: boolean) {
        setAutoDetect(v);
        if (v) {
            setMetaTypeOverride('auto');
        } else {
            const detected = file ? detectMetaType(file) : 'unknown';
            setMetaTypeOverride(detected !== 'unknown' ? detected : '');
        }
    }
    const previewRef = useRef<HTMLDivElement>(null);
    const sidePanelRef = useRef<ImperativePanelHandle>(null);
    const [openPanel, setOpenPanel] = useState<'theme' | 'options' | null>(null);

    useEffect(() => {
        sidePanelRef.current?.collapse();
    }, []);

    function togglePanel(panel: 'theme' | 'options') {
        const p = sidePanelRef.current;
        if (!p) return;
        if (openPanel === panel) {
            p.collapse();
            setOpenPanel(null);
        } else {
            setOpenPanel(panel);
            if (p.isCollapsed()) p.expand();
        }
    }

    const rendererType: MetaType | undefined =
        metaTypeOverride && metaTypeOverride !== 'auto' ? metaTypeOverride : undefined;

    return (
        <Layout noFooter title={'Playground'}>
            <div className={styles.PageContent}>
                <PlaygroundToolbar
                    fileFormat={fileFormat}
                    onFileFormatChange={setFileFormat}
                    isEmpty={isEmpty}
                    onCopy={async () => {
                        await editorRef.current?.copy();
                    }}
                    onClear={() => editorRef.current?.clear()}
                    metaType={metaTypeOverride}
                    onMetaTypeChange={handleMetaTypeChange}
                    openPanel={openPanel}
                    onToggleTheme={() => togglePanel('theme')}
                    onToggleOptions={() => togglePanel('options')}
                />
                <PanelGroup direction="horizontal" className={styles.Container}>
                    <Panel
                        ref={sidePanelRef}
                        defaultSize={22}
                        minSize={15}
                        maxSize={40}
                        className={styles.Panel}
                        collapsible={true}
                        collapsedSize={0}
                        onCollapse={() => setOpenPanel(null)}
                    >
                        <div className={styles.ThemePanel}>
                            <BrowserOnly>
                                {() => (
                                    <>
                                        {/* Both panels stay mounted so their local state survives
                                            switching between them; CSS toggles which one is visible. */}
                                        <div style={{ display: openPanel === 'theme' ? 'contents' : 'none' }}>
                                            <ThemeEditor
                                                target={previewRef}
                                                file={file}
                                                onClose={() => togglePanel('theme')}
                                                onThemeChange={setRendererTheme}
                                            />
                                        </div>
                                        <Suspense fallback={null}>
                                            <div style={{ display: openPanel === 'options' ? 'contents' : 'none' }}>
                                                <OptionsEditor
                                                    onOptionsChange={setRendererOptions}
                                                    onClose={() => togglePanel('options')}
                                                    autoDetect={autoDetect}
                                                    onAutoDetectChange={handleAutoDetectChange}
                                                    strictTypeCheck={strictTypeCheck}
                                                    onStrictTypeCheckChange={setStrictTypeCheck}
                                                />
                                            </div>
                                        </Suspense>
                                    </>
                                )}
                            </BrowserOnly>
                        </div>
                    </Panel>
                    <PanelResizeHandle className={styles.ResizeHandle}>
                        <div className={styles.ResizeHandleInner} />
                    </PanelResizeHandle>
                    <Panel className={styles.Panel}>
                        <div className={styles.LeftPanel}>
                            <EditorComponent
                                ref={editorRef}
                                onChange={setFile}
                                fileFormat={fileFormat}
                                onFileFormatChange={setFileFormat}
                                isEmpty={isEmpty}
                                onIsEmptyChange={setIsEmpty}
                            />
                        </div>
                    </Panel>
                    <PanelResizeHandle className={styles.ResizeHandle}>
                        <div className={styles.ResizeHandleInner} />
                    </PanelResizeHandle>
                    <Panel
                        defaultSize={40}
                        minSize={20}
                        maxSize={70}
                        className={styles.Panel}
                        collapsible={true}
                        collapsedSize={0}
                    >
                        <div className={styles.RightPanel}>
                            <Renderer
                                ref={previewRef}
                                file={file}
                                type={rendererType}
                                theme={rendererTheme}
                                options={rendererOptions}
                            />
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </Layout>
    );
}
