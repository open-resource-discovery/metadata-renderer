import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './index.module.css';

import OpenapiLight from '@site/static/img/formats/openapi/normal-light.svg';
import OpenapiDark from '@site/static/img/formats/openapi/normal-dark.svg';
import AsyncapiLight from '@site/static/img/formats/asyncapi/normal-light.svg';
import AsyncapiDark from '@site/static/img/formats/asyncapi/normal-dark.svg';
import A2aLight from '@site/static/img/formats/a2a/normal-light.svg';
import A2aDark from '@site/static/img/formats/a2a/normal-dark.svg';
import McpLight from '@site/static/img/formats/mcp/normal-light.svg';
import McpDark from '@site/static/img/formats/mcp/normal-dark.svg';
import CsnLight from '@site/static/img/formats/csn-interop/normal-light.svg';
import CsnDark from '@site/static/img/formats/csn-interop/normal-dark.svg';
import OrdOverlayLight from '@site/static/img/formats/ord-overlay/normal-light.svg';
import OrdOverlayDark from '@site/static/img/formats/ord-overlay/normal-dark.svg';

type FormatItem = {
    id: string;
    label: string;
    anchor: string;
    LogoLight: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    LogoDark?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const FORMATS: FormatItem[] = [
    { id: 'openapi', label: 'OpenAPI', anchor: 'openapi', LogoLight: OpenapiLight, LogoDark: OpenapiDark },
    { id: 'asyncapi', label: 'AsyncAPI', anchor: 'asyncapi', LogoLight: AsyncapiLight, LogoDark: AsyncapiDark },
    { id: 'a2a', label: 'A2A', anchor: 'a2a', LogoLight: A2aLight, LogoDark: A2aDark },
    { id: 'mcp', label: 'MCP', anchor: 'mcp', LogoLight: McpLight, LogoDark: McpDark },
    { id: 'csn', label: 'CSN:interop', anchor: 'csn-interop', LogoLight: CsnLight, LogoDark: CsnDark },
    {
        id: 'ord-overlay',
        label: 'ORD Overlay',
        anchor: 'ord-overlay',
        LogoLight: OrdOverlayLight,
        LogoDark: OrdOverlayDark,
    },
];

function SupportedTypes(): React.JSX.Element {
    const { colorMode } = useColorMode();

    return (
        <section className={styles.supported}>
            <div className={styles.supportedInner}>
                <h2 className={styles.supportedTitle}>Supported document types</h2>
                <ul className={styles.typeList} role="list" aria-label="Supported formats">
                    {FORMATS.map(({ id, label, anchor, LogoLight, LogoDark }) => {
                        const Logo = colorMode === 'light' ? LogoLight : (LogoDark ?? LogoLight);
                        return (
                            <li key={id} className={styles.typeItem}>
                                <Link to={`/docs/Supported#${anchor}`} className={styles.typeLink} aria-label={label}>
                                    <div className={styles.logoContainer} data-format={id}>
                                        <Logo className={styles.logo} aria-hidden="true" />
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}

export default function Home(): React.JSX.Element {
    return (
        <Layout
            title="Metadata Renderer"
            description="A single React component that renders ORD API metadata documents into a structured, navigable UI."
        >
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <img src="img/Metadata renderer.svg" className={styles.heroLogo} />

                    <h1 className={styles.heroTitle}>Metadata Renderer</h1>
                    <p className={styles.heroSubtitle}>
                        A single React component that renders ORD API metadata documents from JSON or YAML into a
                        structured, navigable UI.
                    </p>
                    <div className={styles.heroCta}>
                        <Link className="button button--primary button--lg" to="/playground">
                            Playground
                        </Link>
                    </div>
                </div>
            </section>

            <SupportedTypes />
        </Layout>
    );
}
