import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import styles from "./portfolio.module.css";
import { AppLayout } from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import Dialog from "../../components/Dialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import CreatePostDialog from "../../components/CreatePost";
import ImageCarousel from "../../components/PostList/ImageCarousel.jsx";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import InfiniteSentinel from "../../components/InfiniteSentinel";
import { useAuth, useFilter, useUserProfile } from "../../hooks";
import { useInfinitePosts } from "../../hooks/useInfinitePosts.js";
import { deletePost, getAllPostsByUser, getImageUrl } from "../../services";
import { getErrorMessage } from "../../lib/api.js";
import { formatDate } from "../../utils/time.js";

const PAGE_SIZE = 12;

// Portfólio: grade com as obras de um artista (as suas ou de quem você abriu)
export default function Portfolio() {
  const { userId: paramId } = useParams();
  const { user } = useAuth();

  const ownerId = paramId ?? user?.id;
  const isOwn = !paramId || String(paramId) === String(user?.id);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [creating, setCreating] = useState(false);

  const { draft, applied, setField, apply, reset } = useFilter();
  const fetchPosts = useCallback(
    (pageIndex, size, currentFilter) => getAllPostsByUser(ownerId, pageIndex, size, currentFilter),
    [ownerId]
  );
  const { posts, loading, loadingMore, hasMore, error, loadMore, removePost, reload } =
    useInfinitePosts(fetchPosts, PAGE_SIZE, applied, Boolean(ownerId), String(ownerId));

  const selected = selectedIndex !== null ? posts[selectedIndex] ?? null : null;

  // navegação entre obras: setas do teclado e botões; no fim da lista carrega mais
  const go = useCallback((step) => {
    if (selectedIndex === null) return;

    const next = selectedIndex + step;
    if (next < 0 || next >= posts.length) return;

    // perto do fim da lista já pede mais obras
    if (next >= posts.length - 2 && hasMore) loadMore();
    setSelectedIndex(next);
  }, [selectedIndex, posts.length, hasMore, loadMore]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (event) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedIndex, go]);
  const { profile } = useUserProfile(isOwn ? undefined : ownerId);

  const ownerName = isOwn ? "Meu portfólio" : `Portfólio de ${profile?.firstName ?? "artista"}`;

  const handleSearch = () => apply();

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deletePost(toDelete.id);
      removePost(toDelete.id);
      setToDelete(null);
      setSelectedIndex(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err, "Não foi possível excluir."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout
      headerExtra={
        <SearchBar
          value={draft.search}
          onChange={(value) => setField("search", value)}
          onSubmit={handleSearch}
          placeholder="Pesquise no portfólio..."
        />
      }
    >
      <div className={styles["title-row"]}>
        <h1>{ownerName}</h1>
        {isOwn && (
          <Button onClick={() => setCreating(true)}>
            <Plus size={18} aria-hidden="true" /> Novo post
          </Button>
        )}
      </div>

      {loading ? (
        <div className={styles.state}><Spinner size={28} color="#282828" /></div>
      ) : error ? (
        <p className={styles.state}>{error}</p>
      ) : posts.length === 0 ? (
        <div className={styles.state}>
          <ImageIcon size={36} aria-hidden="true" />
          <p>{applied.search ? "Nenhuma obra encontrada." : "Nenhuma obra publicada ainda."}</p>
          {applied.search && (
            <button type="button" className={styles.clear} onClick={reset}>
              Limpar pesquisa
            </button>
          )}
        </div>
      ) : (
        <ul className={styles.grid}>
          {posts.map((post, index) => (
            <li key={post.id} className={styles.card}>
              <div className={styles.heading}>
                <span title={post.title}>{post.title}</span>
                {isOwn && (
                  <button
                    type="button"
                    className={styles.trash}
                    onClick={() => { setDeleteError(""); setToDelete(post); }}
                    aria-label={`Excluir ${post.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <button type="button" className={styles.thumb} onClick={() => setSelectedIndex(index)} aria-label={`Abrir ${post.title}`}>
                {post.images?.[0] ? (
                  <img src={getImageUrl(post.images[0].url)} alt={post.title} loading="lazy" />
                ) : (
                  <span className={styles.noimg}><ImageIcon size={28} /></span>
                )}
                {post.classification === "AI" && <span className={`${styles.badge} ${styles.ai}`}>I.A</span>}
                {post.classification === "HUMAN" && <span className={`${styles.badge} ${styles.human}`}>Arte Humana</span>}
              </button>

              <div className={styles.footer}>
                <span>{formatDate(post.createdAt)}</span>
                <button type="button" className={styles.view} onClick={() => setSelectedIndex(index)}>Visualizar</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {posts.length > 0 && (
        <InfiniteSentinel
          onVisible={loadMore}
          hasMore={hasMore}
          loading={loadingMore}
          endMessage="Essas são todas as obras."
        />
      )}

      <Dialog open={Boolean(selected)} onClose={() => setSelectedIndex(null)} title={selected?.title} width={860}>
        {selected && (
          <div className={styles.detail}>
            <ImageCarousel key={selected.id} images={selected.images} alt={selected.title} />
            {selected.content && <p>{selected.content}</p>}
            <small>{formatDate(selected.createdAt)}</small>

            <div className={styles.pager}>
              <button type="button" onClick={() => go(-1)} disabled={selectedIndex === 0} aria-label="Obra anterior">
                <ChevronLeft size={20} /> Anterior
              </button>
              <span>{selectedIndex + 1} de {posts.length}{hasMore ? "+" : ""}</span>
              <button type="button" onClick={() => go(1)} disabled={selectedIndex >= posts.length - 1} aria-label="Próxima obra">
                Próxima <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Excluir esta obra?"
        message={deleteError || "A obra, as imagens e os comentários são apagados de vez."}
        confirmLabel="Excluir"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
      />

      <CreatePostDialog
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={reload}
      />
    </AppLayout>
  );
}
