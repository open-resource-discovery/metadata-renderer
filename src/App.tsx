import { useState } from 'react';
import { MetadataRenderer } from './lib/core';
import { OpenApiRenderer } from './lib/openApi';
import { CsnRenderer } from './lib/csn';
import { AsyncApiRenderer } from './lib/asyncApi';
import { A2ARenderer } from './lib/a2a';
import { McpRenderer } from './lib/mcp';
import { csn } from './demo/csn';
import { openApi } from './demo/openapi';
import { asyncApi } from './demo/asyncapi';
import { a2a } from './demo/a2a';
import { mcp } from './demo/mcp';

const ALL_RENDERERS = {
    openapi: OpenApiRenderer,
    csn: CsnRenderer,
    asyncapi: AsyncApiRenderer,
    a2a: A2ARenderer,
    mcp: McpRenderer,
};

type Tab = { id: string; label: string; content: string };

const tabs: Tab[] = [
    { id: 'openapi', label: 'OpenAPI', content: openApi },
    { id: 'csn', label: 'CSN', content: csn },
    { id: 'asyncapi', label: 'AsyncAPI', content: asyncApi },
    { id: 'a2a', label: 'A2A', content: a2a },
    { id: 'mcp', label: 'MCP', content: mcp },
];

export function App() {
    const [activeId, setActiveId] = useState(tabs[0].id);
    const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

    return (
        <div className="demo">
            <nav className="demo-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={tab.id === active.id ? 'demo-tab active' : 'demo-tab'}
                        onClick={() => setActiveId(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
            <main className="demo-content">
                <MetadataRenderer key={active.id} content={active.content} renderers={ALL_RENDERERS} />
            </main>
        </div>
    );
}
