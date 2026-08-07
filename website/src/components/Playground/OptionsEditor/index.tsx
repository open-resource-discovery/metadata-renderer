import { useState } from 'react';
import type { MetadataRendererOptions } from '@sap/metadata-renderer';
import s from './optionsEditor.module.css';

type Props = {
    onOptionsChange: (opts: MetadataRendererOptions) => void;
    onClose?: () => void;
    autoDetect: boolean;
    onAutoDetectChange: (v: boolean) => void;
    strictTypeCheck: boolean;
    onStrictTypeCheckChange: (v: boolean) => void;
};

function Toggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className={s.toggleSwitch} htmlFor={id}>
            <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span className={s.toggleSlider} />
        </label>
    );
}

export default function OptionsEditor({
    onOptionsChange,
    onClose,
    autoDetect,
    onAutoDetectChange,
    strictTypeCheck,
    onStrictTypeCheckChange,
}: Props) {
    const [fallback, setFallback] = useState<'error' | 'raw'>('error');
    const [showCustomAttributes, setShowCustomAttributes] = useState(true);
    const [a2aValidation, setA2aValidation] = useState(false);
    const [mcpValidation, setMcpValidation] = useState(false);

    // AsyncAPI show
    const [asyncSidebar, setAsyncSidebar] = useState(false);
    const [asyncInfo, setAsyncInfo] = useState(true);
    const [asyncServers, setAsyncServers] = useState(true);
    const [asyncOperations, setAsyncOperations] = useState(true);
    const [asyncMessages, setAsyncMessages] = useState(true);
    const [asyncMessageExamples, setAsyncMessageExamples] = useState(false);
    const [asyncSchemas, setAsyncSchemas] = useState(true);
    const [asyncErrors, setAsyncErrors] = useState(true);
    // AsyncAPI expand
    const [asyncExpandMsgExamples, setAsyncExpandMsgExamples] = useState(false);
    // AsyncAPI sidebar
    const [asyncShowServers, setAsyncShowServers] = useState<'byDefault' | 'bySpecTags' | 'byServersTags'>('byDefault');
    const [asyncShowOperations, setAsyncShowOperations] = useState<'byDefault' | 'bySpecTags' | 'byOperationsTags'>(
        'byDefault',
    );
    // AsyncAPI labels
    const [publishLabel, setPublishLabel] = useState('');
    const [subscribeLabel, setSubscribeLabel] = useState('');
    const [sendLabel, setSendLabel] = useState('');
    const [receiveLabel, setReceiveLabel] = useState('');
    const [requestLabel, setRequestLabel] = useState('');
    const [replyLabel, setReplyLabel] = useState('');

    function emit(
        patch: Partial<{
            autoDetect: boolean;
            strictTypeCheck: boolean;
            fallback: 'error' | 'raw';
            showCustomAttributes: boolean;
            a2aValidation: boolean;
            a2aConnection: boolean;
            mcpValidation: boolean;
            asyncSidebar: boolean;
            asyncInfo: boolean;
            asyncServers: boolean;
            asyncOperations: boolean;
            asyncMessages: boolean;
            asyncMessageExamples: boolean;
            asyncSchemas: boolean;
            asyncErrors: boolean;
            asyncExpandMsgExamples: boolean;
            asyncShowServers: typeof asyncShowServers;
            asyncShowOperations: typeof asyncShowOperations;
            publishLabel: string;
            subscribeLabel: string;
            sendLabel: string;
            receiveLabel: string;
            requestLabel: string;
            replyLabel: string;
        }>,
    ) {
        const s = {
            autoDetect,
            strictTypeCheck,
            fallback,
            showCustomAttributes,
            a2aValidation,
            mcpValidation,
            asyncSidebar,
            asyncInfo,
            asyncServers,
            asyncOperations,
            asyncMessages,
            asyncMessageExamples,
            asyncSchemas,
            asyncErrors,
            asyncExpandMsgExamples,
            asyncShowServers,
            asyncShowOperations,
            publishLabel,
            subscribeLabel,
            sendLabel,
            receiveLabel,
            requestLabel,
            replyLabel,
            ...patch,
        };
        const opts: MetadataRendererOptions = {
            autoDetect: s.autoDetect,
            strictTypeCheck: s.strictTypeCheck,
            fallback: s.fallback,
            customAttributes: s.showCustomAttributes ? undefined : false,
            a2a: { showValidation: s.a2aValidation, showConnection: s.a2aConnection },
            mcp: { showValidation: s.mcpValidation },
            asyncapi: {
                show: {
                    sidebar: s.asyncSidebar,
                    info: s.asyncInfo,
                    servers: s.asyncServers,
                    operations: s.asyncOperations,
                    messages: s.asyncMessages,
                    messageExamples: s.asyncMessageExamples,
                    schemas: s.asyncSchemas,
                    errors: s.asyncErrors,
                },
                expand: { messageExamples: s.asyncExpandMsgExamples },
                sidebar: { showServers: s.asyncShowServers, showOperations: s.asyncShowOperations },
                ...(s.publishLabel ? { publishLabel: s.publishLabel } : {}),
                ...(s.subscribeLabel ? { subscribeLabel: s.subscribeLabel } : {}),
                ...(s.sendLabel ? { sendLabel: s.sendLabel } : {}),
                ...(s.receiveLabel ? { receiveLabel: s.receiveLabel } : {}),
                ...(s.requestLabel ? { requestLabel: s.requestLabel } : {}),
                ...(s.replyLabel ? { replyLabel: s.replyLabel } : {}),
            },
        };
        onOptionsChange(opts);
    }

    function set<T>(setter: (v: T) => void, key: string) {
        return (v: T) => {
            setter(v);
            emit({ [key]: v });
        };
    }

    return (
        <div className={s.sidebar}>
            <div className={s.header}>
                <div className={s.headerText}>
                    <p className={s.title}>Options</p>
                    <p className={s.subtitle}>Configure renderer behaviour</p>
                </div>
                {onClose && (
                    <button type="button" className={s.closeBtn} onClick={onClose} title="Close">
                        ✕
                    </button>
                )}
            </div>

            <div className={s.sections}>
                {/* General */}
                <details open>
                    <summary className={s.sectionTitle}>General</summary>
                    <div className={s.sectionBody}>
                        <div className={s.row}>
                            <span className={s.rowLabel}>Auto-detect format</span>
                            <Toggle
                                id="opt-autoDetect"
                                checked={autoDetect}
                                onChange={(v) => {
                                    onAutoDetectChange(v);
                                    emit({ autoDetect: v });
                                }}
                            />
                        </div>
                        <div className={s.row}>
                            <span className={s.rowLabel}>Show custom attributes</span>
                            <Toggle
                                id="opt-showCustomAttributes"
                                checked={showCustomAttributes}
                                onChange={set(setShowCustomAttributes, 'showCustomAttributes')}
                            />
                        </div>
                        <div className={s.row}>
                            <span className={s.rowLabel}>Ignore type check</span>
                            <Toggle
                                id="opt-strictTypeCheck"
                                checked={!strictTypeCheck}
                                onChange={(v) => {
                                    onStrictTypeCheckChange(!v);
                                    emit({ strictTypeCheck: !v });
                                }}
                            />
                        </div>
                        <div className={s.row}>
                            <span className={s.rowLabel}>Fallback for unsupported types</span>
                        </div>
                        <div className={s.radioGroup}>
                            <label className={s.radioLabel}>
                                <input
                                    type="radio"
                                    name="fallback"
                                    value="error"
                                    checked={fallback === 'error'}
                                    onChange={() => {
                                        setFallback('error');
                                        emit({ fallback: 'error' });
                                    }}
                                />
                                Error message
                            </label>
                            <label className={s.radioLabel}>
                                <input
                                    type="radio"
                                    name="fallback"
                                    value="raw"
                                    checked={fallback === 'raw'}
                                    onChange={() => {
                                        setFallback('raw');
                                        emit({ fallback: 'raw' });
                                    }}
                                />
                                Raw content
                            </label>
                        </div>
                    </div>
                </details>

                {/* A2A */}
                <details>
                    <summary className={s.sectionTitle}>A2A</summary>
                    <div className={s.sectionBody}>
                        <div className={s.row}>
                            <span className={s.rowLabel}>Show validation panel</span>
                            <Toggle
                                id="opt-a2a-validation"
                                checked={a2aValidation}
                                onChange={set(setA2aValidation, 'a2aValidation')}
                            />
                        </div>
                    </div>
                </details>

                {/* MCP */}
                <details>
                    <summary className={s.sectionTitle}>MCP</summary>
                    <div className={s.sectionBody}>
                        <div className={s.row}>
                            <span className={s.rowLabel}>Show validation panel</span>
                            <Toggle
                                id="opt-mcp-validation"
                                checked={mcpValidation}
                                onChange={set(setMcpValidation, 'mcpValidation')}
                            />
                        </div>
                    </div>
                </details>

                {/* AsyncAPI — Show */}
                <details>
                    <summary className={s.sectionTitle}>AsyncAPI — Visibility</summary>
                    <div className={s.sectionBody}>
                        {(
                            [
                                ['Sidebar', asyncSidebar, set(setAsyncSidebar, 'asyncSidebar'), 'opt-async-sidebar'],
                                ['Info', asyncInfo, set(setAsyncInfo, 'asyncInfo'), 'opt-async-info'],
                                ['Servers', asyncServers, set(setAsyncServers, 'asyncServers'), 'opt-async-servers'],
                                [
                                    'Operations',
                                    asyncOperations,
                                    set(setAsyncOperations, 'asyncOperations'),
                                    'opt-async-ops',
                                ],
                                ['Messages', asyncMessages, set(setAsyncMessages, 'asyncMessages'), 'opt-async-msgs'],
                                [
                                    'Message examples',
                                    asyncMessageExamples,
                                    set(setAsyncMessageExamples, 'asyncMessageExamples'),
                                    'opt-async-msgex',
                                ],
                                ['Schemas', asyncSchemas, set(setAsyncSchemas, 'asyncSchemas'), 'opt-async-schemas'],
                                ['Errors', asyncErrors, set(setAsyncErrors, 'asyncErrors'), 'opt-async-errors'],
                            ] as [string, boolean, (v: boolean) => void, string][]
                        ).map(([label, value, handler, id]) => (
                            <div key={id} className={s.row}>
                                <span className={s.rowLabel}>{label}</span>
                                <Toggle id={id} checked={value} onChange={handler} />
                            </div>
                        ))}
                        <div className={s.row}>
                            <span className={s.rowLabel}>Expand message examples</span>
                            <Toggle
                                id="opt-async-expand-msgex"
                                checked={asyncExpandMsgExamples}
                                onChange={set(setAsyncExpandMsgExamples, 'asyncExpandMsgExamples')}
                            />
                        </div>
                    </div>
                </details>

                {/* AsyncAPI — Sidebar grouping */}
                <details>
                    <summary className={s.sectionTitle}>AsyncAPI — Sidebar grouping</summary>
                    <div className={s.sectionBody}>
                        <div>
                            <div className={s.inputLabel}>Show servers</div>
                            <select
                                className={s.select}
                                value={asyncShowServers}
                                onChange={(e) => {
                                    const v = e.target.value as typeof asyncShowServers;
                                    setAsyncShowServers(v);
                                    emit({ asyncShowServers: v });
                                }}
                            >
                                <option value="byDefault">By default</option>
                                <option value="bySpecTags">By spec tags</option>
                                <option value="byServersTags">By servers tags</option>
                            </select>
                        </div>
                        <div>
                            <div className={s.inputLabel}>Show operations</div>
                            <select
                                className={s.select}
                                value={asyncShowOperations}
                                onChange={(e) => {
                                    const v = e.target.value as typeof asyncShowOperations;
                                    setAsyncShowOperations(v);
                                    emit({ asyncShowOperations: v });
                                }}
                            >
                                <option value="byDefault">By default</option>
                                <option value="bySpecTags">By spec tags</option>
                                <option value="byOperationsTags">By operations tags</option>
                            </select>
                        </div>
                    </div>
                </details>

                {/* AsyncAPI — Labels */}
                <details>
                    <summary className={s.sectionTitle}>AsyncAPI — Operation labels</summary>
                    <div className={s.sectionBody}>
                        {(
                            [
                                [
                                    'Publish',
                                    publishLabel,
                                    (v: string) => {
                                        setPublishLabel(v);
                                        emit({ publishLabel: v });
                                    },
                                    'Publish',
                                ],
                                [
                                    'Subscribe',
                                    subscribeLabel,
                                    (v: string) => {
                                        setSubscribeLabel(v);
                                        emit({ subscribeLabel: v });
                                    },
                                    'Subscribe',
                                ],
                                [
                                    'Send',
                                    sendLabel,
                                    (v: string) => {
                                        setSendLabel(v);
                                        emit({ sendLabel: v });
                                    },
                                    'Send',
                                ],
                                [
                                    'Receive',
                                    receiveLabel,
                                    (v: string) => {
                                        setReceiveLabel(v);
                                        emit({ receiveLabel: v });
                                    },
                                    'Receive',
                                ],
                                [
                                    'Request',
                                    requestLabel,
                                    (v: string) => {
                                        setRequestLabel(v);
                                        emit({ requestLabel: v });
                                    },
                                    'Request',
                                ],
                                [
                                    'Reply',
                                    replyLabel,
                                    (v: string) => {
                                        setReplyLabel(v);
                                        emit({ replyLabel: v });
                                    },
                                    'Reply',
                                ],
                            ] as [string, string, (v: string) => void, string][]
                        ).map(([label, value, handler, placeholder]) => (
                            <div key={label}>
                                <div className={s.inputLabel}>{label}</div>
                                <input
                                    className={s.textInput}
                                    type="text"
                                    value={value}
                                    placeholder={placeholder}
                                    onChange={(e) => handler(e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </details>
            </div>
        </div>
    );
}
