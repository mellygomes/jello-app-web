
import { useState } from "react";
import {
  Menu,
  Compass,
  House,
  Users,
  CircleUserRound,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import "./sidebar.css";

const navigation = [
  { name: "Início", icon: House },
  { name: "Comunidade", icon: Users },
  { name: "Perfil", icon: CircleUserRound },
  { name: "Configurações", icon: Settings },
];

export default function Sidebar({ active, setActive }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`sidebar ${expanded ? "sidebar-expanded" : ""}`}
    >
      <button
        type="button"
        className="sidebar-menu"
        onClick={() => setExpanded((previous) => !previous)}
        aria-label={expanded ? "Recolher menu" : "Expandir menu"}
        aria-expanded={expanded}
        title={expanded ? "Recolher menu" : "Expandir menu"}
      >
        {expanded ? <ChevronLeft size={20} /> : <Menu size={20} />}

        {expanded && <span>Recolher menu</span>}
      </button>

      <button
        type="button"
        className="avatar-button"
        onClick={() => setActive("Perfil")}
        aria-label="Meu perfil"
        title="Meu perfil"
      >
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
          alt="Avatar do usuário"
        />

        {expanded && <span>Meu perfil</span>}
      </button>

      <button
        type="button"
        className={`explore-button ${
          active === "Explorar" ? "selected" : ""
        }`}
        onClick={() => setActive("Explorar")}
        title="Explorar"
        aria-label="Explorar"
      >
        <Compass size={19} />

        {expanded && <span>Explorar</span>}
      </button>

      <nav className="side-navigation" aria-label="Menu principal">
        {navigation.map(({ name, icon: Icon }) => (
          <button
            type="button"
            key={name}
            className={`nav-button ${
              active === name ? "selected" : ""
            }`}
            onClick={() => setActive(name)}
            title={name}
            aria-label={name}
            aria-current={active === name ? "page" : undefined}
          >
            <Icon size={19} />

            {expanded && <span>{name}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="nav-button"
          title="Sair"
          aria-label="Sair"
        >
          <LogOut size={19} />

          {expanded && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
