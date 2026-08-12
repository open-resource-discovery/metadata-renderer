import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { useColorMode } from '@docusaurus/theme-common';
import type { MetaType } from '@open-resource-discovery/metadata-renderer';
import { fileExamples, type FileFormats } from '@site/src/components/Playground/example';
import style from './editorComponent.module.css';

export type MetaTypeChoice = MetaType | 'auto' | '';

export interface EditorHandle {
    copy: () => Promise<void>;
    clear: () => void;
}

type Props = {
    fileFormat: FileFormats;
    onFileFormatChange: (f: FileFormats) => void;
    isEmpty: boolean;
    onIsEmptyChange: (isEmpty: boolean) => void;
    onChange: (value: string) => void;
    metaType: MetaTypeChoice;
    onMetaTypeChange: (t: MetaTypeChoice) => void;
    onToggleTheme: () => void;
    onToggleOptions: () => void;
    openPanel?: 'theme' | 'options' | null;
};

const EditorComponent = forwardRef<EditorHandle, Props>(function EditorComponent(
    {
        fileFormat,
        onFileFormatChange,
        isEmpty,
        onIsEmptyChange,
        onChange,
        metaType,
        onMetaTypeChange,
        onToggleTheme,
        onToggleOptions,
        openPanel,
    },
    ref,
) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    let cachedValue = '';

    useImperativeHandle(ref, () => ({
        copy: async () => {
            const value = editorRef.current?.getValue() ?? '';
            await navigator.clipboard.writeText(value);
        },
        clear: () => {
            editorRef.current?.setValue('');
        },
    }));

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function handleEditorChange(value: string | undefined) {
        onIsEmptyChange(!value);

        cachedValue = value ?? '';
        setTimeout(() => {
            if (value === cachedValue) {
                onChange(value || '');
            }
        }, 500);
    }

    return (
        <div className={style.container}>
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
                                    onFileFormatChange(example.extension);
                                    editorRef.current?.setValue(example.content);
                                }}
                                onKeyDown={(key) => {
                                    if (key.key === 'Enter' || key.key === ' ') {
                                        onFileFormatChange(example.extension);
                                        editorRef.current?.setValue(example.content);
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
});

export default EditorComponent;
