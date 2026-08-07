import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import Animation from '@site/src/components/Homepage/animation';
import Supported from '@site/src/components/Homepage/supported';

export default function HomePage() {
    return (
        <>
            <div className={styles.title}>
                <h2 className={styles.header}>
                    <div>Rendering SAP Metadata</div>
                    <div>with one component</div>
                </h2>
                <div className={styles.interaction}>
                    <Link className="button button--secondary button--lg" to="/docs/Setup">
                        Get Started
                    </Link>
                    1 Minute
                </div>
            </div>
            <Animation />
            <Supported />
        </>
    );
}
