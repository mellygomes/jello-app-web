import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import styles from "./post-feed.module.css";
import { AppLayout } from "../Layout";
import SearchBar from "../SearchBar";
import TagFilterBar from "../Filter/TagFilterBar.jsx";
import CreatePostDialog from "../CreatePost";
import PostCard from "../PostList/PostCard.jsx";
import InfiniteSentinel from "../InfiniteSentinel";
import PostComposer from "../PostComposer";
import Button from "../Button";
import Spinner from "../Spinner";
import { useFilter } from "../../hooks/useFilter.js";
import { useInfinitePosts } from "../../hooks/useInfinitePosts.js";

const PAGE_SIZE = 6;

// Lista de posts com busca, filtros e carregamento conforme a rolagem.
// Serve pro Início (com caixa de "o que você está pensando") e pro Explorar (com botão "Novo post").
export default function PostFeed({ title, fetcher, composer = false, endMessage }) {
    const { draft, applied, setField, apply, reset } = useFilter();
    const [creating, setCreating] = useState(false);

    const { posts, loading, loadingMore, hasMore, error, loadMore, removePost, reload } =
        useInfinitePosts(fetcher, PAGE_SIZE, applied);

    // ordenação, tags e "mostrar I.A." aplicam na hora; a busca só ao enviar
    const handleFilter = useCallback((name, value) => {
        setField(name, value);
        if (name !== "search") apply({ ...draft, [name]: value });
    }, [setField, apply, draft]);

    // post novo: volta pra "mais recentes" sem filtros pra ele aparecer no topo
    const handleCreated = () => {
        setField("sort", "RECENT");
        setField("tags", []);
        setField("search", "");
        apply({ ...draft, sort: "RECENT", tags: [], search: "" });
        reload();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filtered = applied.search || applied.tags?.length > 0 || applied.showAi;

    return (
        <AppLayout
            headerExtra={
                <SearchBar
                    value={draft.search}
                    onChange={(value) => setField("search", value)}
                    onSubmit={() => apply()}
                />
            }
        >
            <div className={styles["title-row"]}>
                <h1>{title}</h1>
                {!composer && (
                    <Button onClick={() => setCreating(true)}>
                        <Plus size={18} aria-hidden="true" /> Novo post
                    </Button>
                )}
            </div>

            {composer && <PostComposer onClick={() => setCreating(true)} />}

            <TagFilterBar filter={draft} onChange={handleFilter} />

            {loading ? (
                <div className={styles.state}><Spinner size={28} color="#282828" /></div>
            ) : error && posts.length === 0 ? (
                <p className={styles.state}>{error}</p>
            ) : posts.length === 0 ? (
                <p className={styles.state}>
                    Nada por aqui ainda. Tente outros filtros ou volte mais tarde.
                    {filtered && (
                        <>
                            {" "}
                            <button type="button" className={styles.link} onClick={reset}>
                                Limpar filtros
                            </button>
                        </>
                    )}
                </p>
            ) : (
                <>
                    <section className={styles.grid} aria-label={title}>
                        {posts.map((post) => (
                            <PostCard key={post.id} {...post} onRemove={removePost} />
                        ))}
                    </section>

                    {error && <p className={styles.state}>{error}</p>}
                    <InfiniteSentinel
                        onVisible={loadMore}
                        hasMore={hasMore}
                        loading={loadingMore}
                        endMessage={endMessage}
                    />
                </>
            )}

            <CreatePostDialog
                open={creating}
                onClose={() => setCreating(false)}
                onCreated={handleCreated}
            />
        </AppLayout>
    );
}
