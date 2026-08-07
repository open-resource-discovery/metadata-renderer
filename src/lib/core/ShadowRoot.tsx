import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type ShadowRootProps = {
    styles?: string;
    children: ReactNode;
};

// Mounts children inside an open shadow root so the consumer's CSS cannot
// affect the rendered HTML and vice versa. Used by CsnRenderer to preserve
// the style isolation that the previous custom-element implementation had.
export function ShadowRoot({ styles, children }: ShadowRootProps) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const [shadow, setShadow] = useState<ShadowRoot | null>(null);

    useEffect(() => {
        if (!hostRef.current || hostRef.current.shadowRoot) return;
        setShadow(hostRef.current.attachShadow({ mode: 'open' }));
    }, []);

    return (
        <div ref={hostRef}>
            {shadow &&
                createPortal(
                    <>
                        {styles && <style>{styles}</style>}
                        {children}
                    </>,
                    shadow as unknown as Element,
                )}
        </div>
    );
}
