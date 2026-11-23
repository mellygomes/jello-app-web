import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../lib/api.js";

// Lista de posts que vai crescendo conforme a pessoa rola a tela (página por página).
// scope refaz a busca quando muda o "dono" da lista (ex: outro usuário).
export function useInfinitePosts(fetcher, size, filter, enabled = true, scope = "") {
    const [state, setState] = useState({ key: null, posts: [], page: 0, last: false, total: 0, error: "" });
    const [loadingMore, setLoadingMore] = useState(false);
    const [version, setVersion] = useState(0);

    const key = `${scope}|${size}|${JSON.stringify(filter ?? null)}|${version}`;
    const stateRef = useRef(state);
    const busyRef = useRef(false);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // primeira página (e sempre que filtro/ordenação/dono mudam)
    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;
        busyRef.current = false;

        fetcher(0, size, filter)
            .then((response) => {
                if (cancelled) return;
                setState({
                    key,
                    posts: response.data.content ?? [],
                    page: 0,
                    last: response.data.last ?? true,
                    total: response.data.totalElements ?? 0,
                    error: "",
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setState({
                    key,
                    posts: [],
                    page: 0,
                    last: true,
                    total: 0,
                    error: getErrorMessage(err, "Não foi possível carregar os posts."),
                });
            });

        return () => {
            cancelled = true;
        };
    }, [fetcher, size, filter, enabled, key]);

    const loadMore = useCallback(async () => {
        const current = stateRef.current;
        if (busyRef.current || current.last || current.key !== key || current.error) return;

        busyRef.current = true;
        setLoadingMore(true);
        try {
            const response = await fetcher(current.page + 1, size, filter);
            setState((prev) => {
                if (prev.key !== current.key) return prev;
                const known = new Set(prev.posts.map((post) => post.id));
                const fresh = (response.data.content ?? []).filter((post) => !known.has(post.id));
                return {
                    ...prev,
                    posts: [...prev.posts, ...fresh],
                    page: current.page + 1,
                    last: response.data.last ?? true,
                    total: response.data.totalElements ?? prev.total,
                };
            });
        } catch (err) {
            setState((prev) => ({ ...prev, error: getErrorMessage(err, "Não foi possível carregar mais posts.") }));
        } finally {
            busyRef.current = false;
            setLoadingMore(false);
        }
    }, [fetcher, size, filter, key]);

    const removePost = useCallback((postId) => {
        setState((prev) => ({
            ...prev,
            posts: prev.posts.filter((post) => post.id !== postId),
            total: Math.max(0, prev.total - 1),
        }));
    }, []);

    const reload = useCallback(() => setVersion((v) => v + 1), []);

    const current = state.key === key;

    return {
        posts: state.posts,
        total: state.total,
        loading: enabled && !current,
        loadingMore,
        hasMore: current && !state.last && !state.error,
        error: current ? state.error : "",
        loadMore,
        removePost,
        reload,
    };
}
