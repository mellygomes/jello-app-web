
import { useState } from "react";
import {
  Search,
  Ellipsis,
  
  Palette,
  Image as ImageIcon,
  X,
} from "lucide-react";

import "./portfolio.css";
import Sidebar from "./components/Sidebar/Sidebar";

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

function PaintingCard({ painting, onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="painting-card">
      <div className="card-heading">
        <span title={painting.title}>{painting.title}</span>

        <button
          className="more-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={`Opções de ${painting.title}`}
        >
          <Ellipsis size={17} />
        </button>

        {menuOpen && (
          <div className="card-menu">
            <button
              onClick={() => {
                onOpen(painting);
                setMenuOpen(false);
              }}
            >
              Visualizar pintura
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(painting.title);
                setMenuOpen(false);
              }}
            >
              Copiar título
            </button>
          </div>
        )}
      </div>

      <button
        className={`painting-image ${
          painting.banner ? "banner-image" : ""
        }`}
        onClick={() => onOpen(painting)}
        aria-label={`Abrir ${painting.title}`}
      >
        {painting.banner ? (
          <div className="banner-art">
            <span className="banner-bulb">♧</span>
            <span>constante evolução</span>
          </div>
        ) : (
          <img src={painting.image} alt={painting.title} />
        )}
      </button>

      <div className="card-footer">
        <span>{painting.date}</span>
        <button className="post-button" onClick={() => onOpen(painting)}>
          Postar <span>➤</span>
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
    painting.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="portfolio-page">
      <Sidebar active={active} setActive={setActive} />

      <main className="portfolio-content">
        <header className="topbar">
          <div className="brand">
            <Palette size={29} strokeWidth={1.9} />
            <span>JelloArt</span>
          </div>

          <label className="search-box">
            <input
              type="search"
              placeholder="Pesquise no seu portfólio..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Search size={19} />
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
                <p>Nenhuma pintura encontrada.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedPainting && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedPainting(null)}
        >
          <section
            className="painting-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedPainting(null)}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <h2>{selectedPainting.title}</h2>

            {selectedPainting.image ? (
              <img
                src={selectedPainting.image}
                alt={selectedPainting.title}
              />
            ) : (
              <div className="banner-art modal-banner">
                <span>constante evolução</span>
              </div>
            )}

            <p>{selectedPainting.date}</p>

            <button
              className="modal-post"
              onClick={() => {
                alert(`Preparando postagem: ${selectedPainting.title}`);
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
