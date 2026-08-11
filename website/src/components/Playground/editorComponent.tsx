import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useColorMode } from '@docusaurus/theme-common';
import type { MetaType } from '@open-resource-discovery/metadata-renderer';
import { fileExamples, FileFormats } from '@site/src/components/Playground/example';
import style from './editorComponent.module.css';

export type MetaTypeChoice = MetaType | 'auto' | '';

type Props = {
    onChange: (value: string) => void;
    metaType: MetaTypeChoice;
    onMetaTypeChange: (t: MetaTypeChoice) => void;
    onToggleTheme: () => void;
    onToggleOptions: () => void;
    openPanel?: 'theme' | 'options' | null;
};

export default function EditorComponent({
    onChange,
    metaType,
    onMetaTypeChange,
    onToggleTheme,
    onToggleOptions,
    openPanel,
}: Props) {
    const [fileFormat, setFileFormat] = useState<FileFormats>('json');
    const [isEmpty, setIsEmpty] = useState(true);
    const [copied, setCopied] = useState(false);

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
    let cachedValue = '';

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function handleEditorChange(value) {
        setIsEmpty(!value);

        // reduce the number of onChange calls by adding a delay
        cachedValue = value;
        setTimeout(() => {
            if (value === cachedValue) {
                onChange(value || '');
            }
        }, 500);
    }

    async function handleCopy() {
        const value = editorRef.current?.getValue() ?? '';
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleClear() {
        editorRef.current?.setValue('');
    }

    return (
        <div className={style.container}>
            <div className={style.header}>
                <div className={style.headerLeft}>
                    {openPanel !== 'theme' && (
                        <button type="button" className={style.themeToggle} onClick={onToggleTheme}>
                            Theme Editor
                        </button>
                    )}
                    {openPanel !== 'options' && (
                        <button type="button" className={style.themeToggle} onClick={onToggleOptions}>
                            Options
                        </button>
                    )}
                </div>
                <div className={style.headerRight}>
                    <button type="button" className={style.themeToggle} onClick={handleCopy} disabled={isEmpty}>
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button type="button" className={style.themeToggle} onClick={handleClear} disabled={isEmpty}>
                        Clear
                    </button>
                    <span className="px-2">
                        <span className="mr-2">Syntax Highlight</span>
                        <select
                            className={style['select-format']}
                            value={fileFormat}
                            onChange={(event) => setFileFormat(event.target.value as FileFormats)}
                        >
                            <option value="json" title="JSON">
                                JSON
                            </option>
                            <option value="yaml" title="YAML">
                                YAML
                            </option>
                        </select>
                    </span>
                    <span className="px-2">
                        <span className="mr-2">Type</span>
                        <select
                            className={style['select-format']}
                            value={metaType}
                            onChange={(event) => onMetaTypeChange(event.target.value as MetaTypeChoice)}
                        >
                            {metaType === '' && (
                                <option value="" disabled>
                                    Select type
                                </option>
                            )}
                            <option value="auto">Automatic detection</option>
                            <option value="openapi">OpenAPI</option>
                            <option value="csn">CSN Interop</option>
                            <option value="asyncapi">AsyncAPI</option>
                            <option value="a2a">A2A</option>
                            <option value="mcp">MCP</option>
                        </select>
                    </span>
                </div>
            </div>
            {isEmpty ? (
                <div className={style['empty-state']}>
                    <h3>Paste your document here</h3>
                    <span className={style.label}>or choose an example below</span>
                    <div className={style.examples}>
                        {fileExamples.map((example) => (
                            <div
                                className={style['example-button']}
                                role="button"
                                tabIndex={0}
                                key={example.name}
                                onClick={() => {
                                    setFileFormat(example.extension);
                                    editorRef.current.setValue(example.content);
                                }}
                                onKeyDown={(key) => {
                                    if (key.key === 'Enter' || key.key === ' ') {
                                        setFileFormat(example.extension);
                                        editorRef.current.setValue(example.content);
                                        key.preventDefault();
                                    }
                                }}
                            >
                                {useColorMode().colorMode === 'dark' ? example.image.dark : example.image.light}
                                {example.name}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            <div className={style.editorWrapper}>
                <Editor
                    height="100%"
                    language={fileFormat}
                    theme={useColorMode().colorMode === 'dark' ? 'vs-dark' : 'light'}
                    onMount={handleEditorDidMount}
                    onChange={handleEditorChange}
                    options={{
                        automaticLayout: true,
                        lineNumbers: 'on',
                        lineNumbersMinChars: 6,
                        minimap: {
                            enabled: false,
                        },
                        hover: {
                            delay: 500,
                            sticky: false,
                        },
                        tabSize: 2,
                        scrollBeyondLastLine: false,
                        scrollbar: {
                            vertical: 'auto',
                            horizontal: 'auto',
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10,
                            alwaysConsumeMouseWheel: false,
                        },
                        padding: {
                            top: 10,
                            bottom: 10,
                        },
                    }}
                />
            </div>
        </div>
    );
}
