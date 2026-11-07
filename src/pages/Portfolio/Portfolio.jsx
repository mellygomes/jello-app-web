import { useEffect, useState } from "react";
import { Search, Ellipsis, Image as ImageIcon, X } from "lucide-react";
import "./portfolio.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { getMyPortfolioPosts } from "../../services/post";

function normalizeText(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function PaintingCard({ painting, onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="painting-card">
      <div className="card-heading">
        <span title={painting.title}>{painting.title}</span>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir opções"
        >
          <Ellipsis size={20} />
        </button>

        {menuOpen && (
          <div className="card-menu">
            <button
              type="button"
              onClick={() => {
                onOpen(painting);
                setMenuOpen(false);
              }}
            >
              Visualizar pintura
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard?.writeText) {
                  navigator.clipboard.writeText(painting.title).catch(() => {});
                }

                setMenuOpen(false);
              }}
            >
              Copiar título
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="painting-image"
        onClick={() => onOpen(painting)}
      >
        {painting.image ? (
          <img src={painting.image} alt={painting.title} />
        ) : (
          <div className="painting-no-image">
            <ImageIcon size={32} />
            <span>Sem imagem</span>
          </div>
        )}
      </button>

      <div className="card-footer">
        <span>
          {painting.createdAt
            ? new Date(painting.createdAt).toLocaleDateString("pt-BR")
            : ""}
        </span>

        <span
          className={`post-status ${painting.visible ? "published" : "draft"}`}
        >
          {painting.visible ? "Publicado" : "Rascunho"}
        </span>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("Início");
  const [selectedPainting, setSelectedPainting] = useState(null);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        const response = await getMyPortfolioPosts(page, 12);

        setPosts(
          Array.isArray(response.data.content) ? response.data.content : [],
        );

        setTotalPages(response.data.totalPages ?? 0);
      } catch (err) {
        console.error("Erro ao carregar portfólio:", err);
        setError("Não foi possível carregar seu portfólio.");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [page]);

  const paintings = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    image: post.images?.[0]?.url ?? null,
    images: post.images ?? [],
    tags: post.tags ?? [],
    likes: post.likes ?? 0,
    comments: post.comments ?? 0,
    createdAt: post.createdAt,
    visible: post.visible,
  }));

  const filteredPaintings = paintings.filter((painting) =>
    normalizeText(painting.title).includes(normalizeText(search)),
  );

  return (
    <div className="portfolio-page">
      <Sidebar active={active} setActive={setActive} />

      <main className="portfolio-content">
        <header className="topbar">
          <a className="brand" href="/" aria-label="JelloArt - Início">
            <img src="/jello-icon.svg" alt="" className="brand-icon" />
            <span>JelloArt</span>
          </a>

          <label className="search-box">
            <input
              type="search"
              placeholder="Pesquise no seu portfólio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Pesquisar pinturas no portfólio"
            />

            <Search className="search-icon" size={19} />
          </label>
        </header>

        <section className="portfolio-section">
          <h1>{active === "Início" ? "Portfólio" : active}</h1>

          <div className="storage">
            <span className="storage-label">Espaço Utilizado:</span>

            <div className="storage-row">
              <div
                className="storage-track"
                role="progressbar"
                aria-label="Espaço utilizado"
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="storage-fill" />
              </div>

              <span className="storage-percent">50%</span>
            </div>

            <span className="storage-caption">
              250 Gigas de 500 Gigabytes usados
            </span>
          </div>

          {loading && (
            <div className="empty-state">
              <p>Carregando seu portfólio...</p>
            </div>
          )}

          {!loading && error && (
            <div className="empty-state">
              <p>{error}</p>

              <button type="button" onClick={() => setPage(0)}>
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="paintings-grid">
                {filteredPaintings.map((painting) => (
                  <PaintingCard
                    key={painting.id}
                    painting={painting}
                    onOpen={setSelectedPainting}
                  />
                ))}

                {filteredPaintings.length === 0 && (
                  <div className="empty-state">
                    <ImageIcon size={32} />

                    <p>
                      {search
                        ? "Nenhuma pintura encontrada."
                        : "Seu portfólio está vazio."}
                    </p>

                    {search && (
                      <button type="button" onClick={() => setSearch("")}>
                        Limpar pesquisa
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!search && totalPages > 1 && (
                <div className="portfolio-pagination">
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    Anterior
                  </button>

                  <span>
                    Página {page + 1} de {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {selectedPainting && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedPainting(null)}
        >
          <section
            className="painting-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="painting-modal-title"
          >
            <button
              className="modal-close"
              onClick={() => setSelectedPainting(null)}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <h2 id="painting-modal-title">{selectedPainting.title}</h2>

            {selectedPainting.image ? (
              <img src={selectedPainting.image} alt={selectedPainting.title} />
            ) : (
              <div className="painting-no-image">
                <ImageIcon size={32} />
                <span>Sem imagem</span>
              </div>
            )}

            {selectedPainting.content && <p>{selectedPainting.content}</p>}

            <p>
              {selectedPainting.likes} curtidas · {selectedPainting.comments}{" "}
              comentários
            </p>

            <button
              className="modal-post"
              onClick={() => setSelectedPainting(null)}
            >
              Fechar
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
