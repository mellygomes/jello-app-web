import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./dialog.module.css";

// Janela modal simples (fundo escuro, X no canto, fecha com Esc)
export default function Dialog({ open, onClose, title, width = 640, children, footer }) {
    const titleId = useId();
    const boxRef = useRef(null);
    const onCloseRef = useRef(onClose);

    // guarda o onClose mais novo sem refazer o efeito (senão o foco volta pra caixa a cada tecla digitada)
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return;

        const onKey = (event) => {
            if (event.key === "Escape") onCloseRef.current?.();
        };
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;

        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        boxRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
            <section
                ref={boxRef}
                className={styles.box}
                style={{ maxWidth: width }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                tabIndex={-1}
            >
                <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
                    <X size={30} strokeWidth={1.8} />
                </button>

                {title && <h2 id={titleId} className={styles.title}>{title}</h2>}

                <div className={styles.body}>{children}</div>

                {footer && <div className={styles.footer}>{footer}</div>}
            </section>
        </div>,
        document.body
    );
}
