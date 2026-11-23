import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Menu,
  Compass,
  House,
  Users,
  CircleUserRound,
  Settings,
  LogOut,
  ChevronLeft,
  Images,
} from "lucide-react";

import { useAuth } from "../../../../contexts/auth/useAuth";
import { logOut } from "../../../../services/auth";

import "./sidebar.css";

const navigation = [
  {
    name: "Início",
    icon: House,
    path: "/",
  },
  {
    name: "Explorar",
    icon: Compass,
    path: null,
  },
  {
    name: "Comunidade",
    icon: Users,
    path: null,
  },
  {
    name: "Perfil",
    icon: CircleUserRound,
    path: "/my-profile",
  },
  {
    name: "Portfólio",
    icon: Images,
    path: "/portfolio",
  },
  {
    name: "Configurações",
    icon: Settings,
    path: null,
  },
];

export default function Sidebar({ active, setActive }) {
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleNavigation(name, path) {
    setActive(name);

    if (path) {
      navigate(path);
    }
  }

  async function handleLogout() {
    try {
      await logOut();
    } catch (error) {
      // Continua encerrando a sessão local.
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  }

  return (
    <aside className={`sidebar ${expanded ? "sidebar-expanded" : ""}`}>
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
        onClick={() => handleNavigation("Perfil", "/my-profile")}
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
        className={`explore-button ${active === "Explorar" ? "selected" : ""}`}
        onClick={() => handleNavigation("Explorar", null)}
        title="Explorar"
        aria-label="Explorar"
      >
        <Compass size={19} />

        {expanded && <span>Explorar</span>}
      </button>

      <nav className="side-navigation" aria-label="Menu principal">
        {navigation.map(({ name, icon: Icon, path }) => (
          <button
            type="button"
            key={name}
            className={`nav-button ${active === name ? "selected" : ""}`}
            onClick={() => handleNavigation(name, path)}
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
          onClick={handleLogout}
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
