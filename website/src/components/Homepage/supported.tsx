import mainStyle from './styles.module.css';
import styles from './supported.module.css';
import { useColorMode } from '@docusaurus/theme-common';
import OpenApiImg from './img/openapi-text-logo.svg';
import CsnDarkImg from './img/csn-interop-logo-dark.svg';
import CsnLightImg from './img/csn-interop-logo.svg';

export default function Supported() {
    return (
        <div className={styles.supported}>
            <h2 className={mainStyle.header}>Supported document types</h2>
            <div className={styles.types}>
                {useColorMode().colorMode === 'dark' ? (
                    <CsnDarkImg className={styles.img} aria-label="csn interop" />
                ) : (
                    <CsnLightImg className={styles.img} aria-label="csn interop" />
                )}
                <OpenApiImg className={styles.img} aria-label="open api" />
            </div>
        </div>
    );
}
