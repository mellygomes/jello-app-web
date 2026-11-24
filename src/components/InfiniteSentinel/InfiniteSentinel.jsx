import { useEffect, useRef } from "react";
import Spinner from "../Spinner";
import styles from "./infinite-sentinel.module.css";

// Marcador no fim da lista: quando aparece na tela, pede a próxima página.
export default function InfiniteSentinel({ onVisible, hasMore, loading, endMessage = "Você chegou ao fim." }) {
    const ref = useRef(null);
    const callbackRef = useRef(onVisible);

    useEffect(() => {
        callbackRef.current = onVisible;
    }, [onVisible]);

    useEffect(() => {
        const node = ref.current;
        if (!node || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => entries[0].isIntersecting && callbackRef.current?.(),
            { rootMargin: "500px 0px" }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [hasMore, loading]);

    return (
        <div ref={ref} className={styles.sentinel}>
            {loading && <Spinner size={22} color="#282828" />}
            {!hasMore && !loading && <span>{endMessage}</span>}
        </div>
    );
}
