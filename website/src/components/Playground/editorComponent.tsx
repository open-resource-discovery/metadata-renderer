import type * as monaco from 'monaco-editor';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useColorMode } from '@docusaurus/theme-common';
import type { MetaType } from '@open-resource-discovery/metadata-renderer';
import {
    fileExamples,
    type ExampleId,
    type FileExample,
    type FileFormats,
} from '@site/src/components/Playground/example';
import style from './editorComponent.module.css';

export type MetaTypeChoice = MetaType | 'auto' | '';

export interface EditorHandle {
    copy: () => Promise<void>;
    clear: () => void;
}

type Props = {
    selectedExample?: FileExample;
    onExampleSelect: (id: ExampleId) => void;
    fileFormat: FileFormats;
    onFileFormatChange: (f: FileFormats) => void;
    isEmpty: boolean;
    onIsEmptyChange: (isEmpty: boolean) => void;
    onChange: (value: string) => void;
};

const EditorComponent = forwardRef<EditorHandle, Props>(function EditorComponent(
    { selectedExample, onExampleSelect, fileFormat, onFileFormatChange, isEmpty, onIsEmptyChange, onChange },
    ref,
) {
    const { colorMode } = useColorMode();
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const changeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    const loadExample = useCallback(
        (example: FileExample) => {
            if (!editorRef.current) return;

            onFileFormatChange(example.extension);
            editorRef.current.setValue(example.content);
            if (changeTimeoutRef.current !== null) {
                clearTimeout(changeTimeoutRef.current);
                changeTimeoutRef.current = null;
            }
            onIsEmptyChange(false);
            onChange(example.content);
        },
        [onFileFormatChange, onIsEmptyChange, onChange],
    );

    useEffect(() => {
        if (isEditorReady && selectedExample) {
            loadExample(selectedExample);
        }
    }, [isEditorReady, selectedExample, loadExample]);

    useEffect(
        () => () => {
            if (changeTimeoutRef.current !== null) {
                clearTimeout(changeTimeoutRef.current);
            }
        },
        [],
    );

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
        setIsEditorReady(true);
    }

    function handleEditorChange(value: string | undefined) {
        onIsEmptyChange(!value);

        if (changeTimeoutRef.current !== null) {
            clearTimeout(changeTimeoutRef.current);
        }
        changeTimeoutRef.current = setTimeout(() => {
            changeTimeoutRef.current = null;
            onChange(value ?? '');
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
                                onClick={() => onExampleSelect(example.id)}
                                onKeyDown={(key) => {
                                    if (key.key === 'Enter' || key.key === ' ') {
                                        onExampleSelect(example.id);
                                        key.preventDefault();
                                    }
                                }}
                            >
                                {colorMode === 'dark' ? example.image.dark : example.image.light}
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
                    theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
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
