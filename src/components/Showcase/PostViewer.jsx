import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Dialog from "../Dialog";
import PostCard from "../PostList/PostCard.jsx";
import styles from "./showcase.module.css";

// Janela com o post completo (curtir, comentar, votar...) e setas pra andar pela lista de onde ele saiu
export default function PostViewer({ viewer, onChange, onClose, onRemove }) {
    const open = Boolean(viewer);
    const posts = viewer?.posts ?? [];
    const index = viewer?.index ?? 0;
    const post = posts[index];

    const go = useCallback((step) => {
        const next = index + step;
        if (next >= 0 && next < posts.length) onChange(next);
    }, [index, posts.length, onChange]);

    useEffect(() => {
        if (!open) return;

        const onKey = (event) => {
            // não rouba as setas de quem está digitando um comentário
            if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, go]);

    return (
        <Dialog
            open={open && Boolean(post)}
            onClose={onClose}
            width={760}
            footer={
                posts.length > 1 && (
                    <div className={styles.pager}>
                        <button type="button" onClick={() => go(-1)} disabled={index === 0}>
                            <ChevronLeft size={20} aria-hidden="true" /> Anterior
                        </button>
                        <span>{index + 1} de {posts.length}</span>
                        <button type="button" onClick={() => go(1)} disabled={index >= posts.length - 1}>
                            Próxima <ChevronRight size={20} aria-hidden="true" />
                        </button>
                    </div>
                )
            }
        >
            {post && (
                <div className={styles["viewer-body"]}>
                    <PostCard
                        key={post.id}
                        {...post}
                        onRemove={(id) => {
                            onRemove?.(id);
                            onClose();
                        }}
                    />
                </div>
            )}
        </Dialog>
    );
}
