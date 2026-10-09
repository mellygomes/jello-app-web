import { useState } from 'react';
import {
  Menu,
  Compass,
  House,
  Users,
  CircleUserRound,
  Settings,
  LogOut,
} from "lucide-react";
import './sidebar.css'

const Sidebar = ( active, setActive ) => {

    const navigation = [
    { name: "Início", icon: House },
    { name: "Comunidade", icon: Users },
    { name: "Perfil", icon: CircleUserRound },
    { name: "Configurações", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <button className="sidebar-menu" aria-label="Abrir menu">
        <Menu size={20} />
      </button>

      <button className="avatar-button" aria-label="Meu perfil">
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
          alt="Avatar"
        />
      </button>

      <button
        className={`explore-button ${
          active === "Explorar" ? "selected" : ""
        }`}
        onClick={() => setActive("Explorar")}
        aria-label="Explorar"
      >
        <Compass size={19} />
      </button>

      <nav className="side-navigation">
        {navigation.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`nav-button ${
              active === name ? "selected" : ""
            }`}
            onClick={() => setActive(name)}
            title={name}
          >
            <Icon size={19} />
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-button" title="Sair">
          <LogOut size={19} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar