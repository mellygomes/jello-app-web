import { useState } from "react";
import { Search, Ellipsis, Image as ImageIcon, X } from "lucide-react";
import styles from "./portfolio.module.css";
import { Sidebar } from "../../components";

const paintings = [
  {
    id: 1,
    title: "Minha pintura: Parque Iluminado",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=700&q=85",
    date: "Há 14 minutos",
  },
  {
    id: 2,
    title: "Aquarela, Sol da meia-noite",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=85",
    date: "18 de maio de 2026",
  },
  {
    id: 3,
    title: "Pinceladas de lavanda",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=85",
    date: "24 de março de 2026",
  },
  {
    id: 4,
    title: "Pop Art - Tigre",
    image:
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=700&q=85",
    date: "12 de fevereiro de 2026",
  },
  {
    id: 5,
    title: "Ideia de Banner pro Perfil",
    image: null,
    date: "03 de janeiro de 2026",
    banner: true,
  },
  {
    id: 6,
    title: "Mesma pintura só que antes",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=700&q=85",
    date: "30 de novembro de 2025",
  },
];

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function PaintingCard({ painting, onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className={styles["painting-card"]}>
      <div className={styles["card-heading"]}>
        <span title={painting.title}>{painting.title}</span>

        <button
          type="button"
          className={styles["more-button"]}
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={`Opções de ${painting.title}`}
          aria-expanded={menuOpen}
        >
          <Ellipsis size={17} />
        </button>

        {menuOpen && (
          <div className={styles["card-menu"]}>
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
                  navigator.clipboard
                    .writeText(painting.title)
                    .catch(() => {});
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
        className={`${styles["painting-image"]} ${
          painting.banner ? styles["banner-image"] : ""
        }`}
        onClick={() => onOpen(painting)}
        aria-label={`Abrir ${painting.title}`}
      >
        {painting.banner ? (
          <div className={styles["banner-art"]}>
            <span className={styles["banner-bulb"]}>♧</span>
            <span>constante evolução</span>
          </div>
        ) : (
          <img src={painting.image} alt={painting.title} />
        )}
      </button>

      <div className={styles["card-footer"]}>
        <span>{painting.date}</span>

        <button
          type="button"
          className={styles["post-button"]}
          onClick={() => onOpen(painting)}
        >
          <span>Postar</span>
          <span aria-hidden="true">➤</span>
        </button>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("Início");
  const [selectedPainting, setSelectedPainting] = useState(null);

  const filteredPaintings = paintings.filter((painting) =>
    normalizeText(painting.title).includes(normalizeText(search))
  );

  return (
    <div className={styles["portfolio-page"]}>
      <Sidebar active={active} setActive={setActive} />

      <main className={styles["portfolio-content"]}>
        <header className={styles["topbar"]}>
          <a className={styles["brand"]} href="/" aria-label="JelloArt - Início">
            <img
              src="/jellyfish.png"
              alt=""
              className={styles["brand-icon"]}
              aria-hidden="true"
            />
            <span>JelloArt</span>
          </a>

          <label className={styles["search-box"]}>
            <input
              type="search"
              placeholder="Pesquise no seu portfólio..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Pesquisar pinturas no portfólio"
            />

            <Search
              className={styles["search-icon"]}
              size={19}
              aria-hidden="true"
            />
          </label>
        </header>

        <section className={styles["portfolio-section"]}>
          <h1>{active === "Início" ? "Portfólio" : active}</h1>

          <div className={styles["storage"]}>
            <span className={styles["storage-label"]}>Espaço Utilizado:</span>

            <div className={styles["storage-row"]}>
              <div
                className={styles["storage-track"]}
                role="progressbar"
                aria-label="Espaço utilizado"
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={styles["storage-fill"]} />
              </div>

              <span className={styles["storage-percent"]}>50%</span>
            </div>

            <span className={styles["storage-caption"]}>
              250 Gigas de 500 Gigabytes usados
            </span>
          </div>

          <div className={styles["paintings-grid"]}>
            {filteredPaintings.map((painting) => (
              <PaintingCard
                key={painting.id}
                painting={painting}
                onOpen={setSelectedPainting}
              />
            ))}

            {filteredPaintings.length === 0 && (
              <div className={styles["empty-state"]}>
                <ImageIcon size={32} />
                <p>Nenhuma pintura encontrada.</p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                >
                  Limpar pesquisa
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedPainting && (
        <div
          className={styles["modal-backdrop"]}
          onClick={() => setSelectedPainting(null)}
        >
          <section
            className={styles["painting-modal"]}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="painting-modal-title"
          >
            <button
              type="button"
              className={styles["modal-close"]}
              onClick={() => setSelectedPainting(null)}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <h2 id="painting-modal-title">
              {selectedPainting.title}
            </h2>

            {selectedPainting.image ? (
              <img
                src={selectedPainting.image}
                alt={selectedPainting.title}
              />
            ) : (
              <div className={styles["banner-art modal-banner"]}>
                <span className={styles["banner-bulb"]}>♧</span>
                <span>constante evolução</span>
              </div>
            )}

            <p>{selectedPainting.date}</p>

            <button
              type="button"
              className={styles["modal-post"]}
              onClick={() => {
                alert(
                  `Preparando postagem: ${selectedPainting.title}`
                );
                setSelectedPainting(null);
              }}
            >
              Postar pintura
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
