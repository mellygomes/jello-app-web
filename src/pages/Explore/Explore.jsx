import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import styles from "./explore.module.css";
import { AppLayout } from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import TagFilterBar from "../../components/Filter/TagFilterBar.jsx";
import CreatePostDialog from "../../components/CreatePost";
import InfiniteSentinel from "../../components/InfiniteSentinel";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import {
    ArtistShelf,
    CommunityHelp,
    MasonryGrid,
    PostViewer,
    StyleShelf,
    TrendingStrip
} from "../../components/Showcase";
import { useAuth } from "../../hooks/useAuth.js";
import { useFilter } from "../../hooks/useFilter.js";
import { useTags } from "../../hooks/useTags.js";
import { useInfinitePosts } from "../../hooks/useInfinitePosts.js";
import { useExploreHighlights } from "../../hooks/useExploreHighlights.js";
import { getExplorePosts } from "../../services";

const PAGE_SIZE = 12;

// Explorar: vitrine de descoberta. Sem filtro mostra as faixas (em alta, estilos, artistas, comunidade);
// com busca ou filtro mostra só os resultados no mural.
export default function Explore() {
    const { user } = useAuth();
    const { tags } = useTags();
    const { draft, applied, setField, apply, reset } = useFilter();

    const [creating, setCreating] = useState(false);
    const [viewer, setViewer] = useState(null);
    const [votes, setVotes] = useState({});

    const filtered = Boolean(applied.search || applied.tags?.length > 0 || applied.showAi || applied.sort !== "RECENT");

    const highlights = useExploreHighlights(!filtered);
    const { posts, loading, loadingMore, hasMore, error, loadMore, removePost, reload } =
        useInfinitePosts(getExplorePosts, PAGE_SIZE, applied);

    // posts sem veredito que ainda não são meus nem tiveram voto meu
    const communityPosts = useMemo(
        () => highlights.pool
            .filter((post) => post.classification === "NONE" && post.userId !== user?.id && post.aiVotes?.myVote == null)
            .slice(0, 8),
        [highlights.pool, user?.id]
    );
    const shownCommunity = communityPosts.map((post) => (votes[post.id] ? { ...post, aiVotes: votes[post.id] } : post));

    const handleFilter = useCallback((name, value) => {
        setField(name, value);
        if (name !== "search") apply({ ...draft, [name]: value });
    }, [setField, apply, draft]);

    const pickStyle = (tagId) => {
        setField("tags", [tagId]);
        apply({ ...draft, tags: [tagId] });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openViewer = useCallback((list, index) => setViewer({ posts: list, index }), []);
    const changeViewer = useCallback((index) => setViewer((current) => (current ? { ...current, index } : current)), []);

    // post novo: limpa os filtros pra ele aparecer no topo do mural
    const handleCreated = () => {
        setField("sort", "RECENT");
        setField("tags", []);
        setField("search", "");
        apply({ ...draft, sort: "RECENT", tags: [], search: "" });
        reload();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AppLayout
            headerExtra={
                <SearchBar
                    value={draft.search}
                    onChange={(value) => setField("search", value)}
                    onSubmit={() => apply()}
                    placeholder="Busque obras, estilos ou artistas..."
                />
            }
        >
            <div className={styles["title-row"]}>
                <h1>Explorar</h1>
                <Button onClick={() => setCreating(true)}>
                    <Plus size={18} aria-hidden="true" /> Novo post
                </Button>
            </div>

            {!filtered && (
                highlights.ready ? (
                    <>
                        <TrendingStrip posts={highlights.trending} onOpen={openViewer} />
                        <StyleShelf tags={tags} pool={highlights.pool} onPick={pickStyle} />
                        <ArtistShelf artists={highlights.artists} onOpen={openViewer} />
                        <CommunityHelp
                            posts={shownCommunity}
                            onOpen={openViewer}
                            onVote={(id, result) => setVotes((current) => ({ ...current, [id]: result }))}
                        />
                    </>
                ) : (
                    <div className={styles.state}><Spinner size={26} color="#282828" /></div>
                )
            )}

            <h2 className={styles["wall-title"]}>{filtered ? "Resultados" : "Descubra mais"}</h2>
            <TagFilterBar filter={draft} onChange={handleFilter} />

            {loading ? (
                <div className={styles.state}><Spinner size={28} color="#282828" /></div>
            ) : error && posts.length === 0 ? (
                <p className={styles.state}>{error}</p>
            ) : posts.length === 0 ? (
                <p className={styles.state}>
                    Nenhuma obra encontrada.{" "}
                    <button type="button" className={styles.link} onClick={reset}>Limpar filtros</button>
                </p>
            ) : (
                <div className={styles.wall}>
                    <MasonryGrid posts={posts} onOpen={openViewer} />
                    <InfiniteSentinel
                        onVisible={loadMore}
                        hasMore={hasMore}
                        loading={loadingMore}
                        endMessage="Você viu tudo por enquanto."
                    />
                </div>
            )}

            <PostViewer
                viewer={viewer}
                onChange={changeViewer}
                onClose={() => setViewer(null)}
                onRemove={removePost}
            />

            <CreatePostDialog
                open={creating}
                onClose={() => setCreating(false)}
                onCreated={handleCreated}
            />
        </AppLayout>
    );
}
