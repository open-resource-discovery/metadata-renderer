import { useState } from 'react';
import type { MetaTypeChoice } from '@site/src/components/Playground/editorComponent';
import type { FileFormats } from '@site/src/components/Playground/example';
import style from './toolbar.module.css';

type Props = {
    fileFormat: FileFormats;
    onFileFormatChange: (f: FileFormats) => void;
    isEmpty: boolean;
    onCopy: () => Promise<void>;
    onClear: () => void;
    metaType: MetaTypeChoice;
    onMetaTypeChange: (t: MetaTypeChoice) => void;
    openPanel: 'theme' | 'options' | null;
    onToggleTheme: () => void;
    onToggleOptions: () => void;
};

export default function PlaygroundToolbar({
    fileFormat,
    onFileFormatChange,
    isEmpty,
    onCopy,
    onClear,
    metaType,
    onMetaTypeChange,
    openPanel,
    onToggleTheme,
    onToggleOptions,
}: Props) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
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
                <button type="button" className={style.themeToggle} onClick={onClear} disabled={isEmpty}>
                    Clear
                </button>
                <span className="px-2">
                    <span className="mr-2">Syntax Highlight</span>
                    <select
                        className={style['select-format']}
                        value={fileFormat}
                        onChange={(event) => onFileFormatChange(event.target.value as FileFormats)}
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
    );
}
