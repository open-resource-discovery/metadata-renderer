import { asyncApiContext } from './context';

export default function AttributeLink({ attributeName }: { attributeName: string }) {
    const href = asyncApiContext.getDocumentationUrl(attributeName);
    if (!href) return null;

    return (
        <a
            href={href}
            style={{ marginLeft: 4, marginTop: 4 }}
            target="_blank"
            rel="noreferrer"
            title="View in AsyncAPI Specification"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z" />
            </svg>
        </a>
    );
}
