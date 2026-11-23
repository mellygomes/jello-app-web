import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../lib/api.js";

// Carrega uma página de posts de qualquer endpoint paginado do back (Page<PostResponseDTO>)
// scope serve só pra refazer a busca quando muda o "dono" da lista (ex: outro usuário)
export function usePagedPosts(fetcher, page, size, filter, enabled = true, scope = "") {
    const [result, setResult] = useState({ key: null, posts: [], total: 0, error: "" });
    const [version, setVersion] = useState(0);

    const key = `${scope}|${page}|${size}|${JSON.stringify(filter ?? null)}|${version}`;

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;

        fetcher(page - 1, size, filter)
            .then((response) => {
                if (cancelled) return;
                setResult({
                    key,
                    posts: response.data.content ?? [],
                    total: response.data.totalElements ?? 0,
                    error: "",
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setResult({
                    key,
                    posts: [],
                    total: 0,
                    error: getErrorMessage(err, "Não foi possível carregar os posts."),
                });
            });

        return () => {
            cancelled = true;
        };
    }, [fetcher, page, size, filter, enabled, key]);

    const removePost = useCallback((postId) => {
        setResult((current) => ({
            ...current,
            posts: current.posts.filter((post) => post.id !== postId),
            total: Math.max(0, current.total - 1),
        }));
    }, []);

    const reload = useCallback(() => setVersion((v) => v + 1), []);

    return {
        posts: result.posts,
        total: result.total,
        loading: enabled && result.key !== key,
        error: result.key === key ? result.error : "",
        removePost,
        reload,
    };
}
