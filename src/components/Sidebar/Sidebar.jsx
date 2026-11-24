import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CircleUserRound, House, Users, Settings, ShieldCheck, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import Avatar from "../Avatar";
import FollowButton from "../FollowButton";
import { useAuth } from "../../hooks/useAuth.js";
import { useSuggestions } from "../../hooks/useSuggestions.js";
import { useLogout } from "../../hooks/useLogout.js";
import compassIcon from "../../assets/figma/compass.svg";
import logoutIcon from "../../assets/figma/logout.svg";
import styles from "./sidebar.module.css";

const STORAGE_KEY = "jello:sidebar-expanded";

function readExpanded() {
    try {
        return localStorage.getItem(STORAGE_KEY) !== "false";
    } catch {
        return true;
    }
}

export default function Sidebar() {
    const { user, isModerator } = useAuth();
    const handleLogout = useLogout();
    const [expanded, setExpanded] = useState(readExpanded);
    const { suggestions, setFollowing } = useSuggestions(3, Boolean(user));

    const toggle = () => {
        setExpanded((prev) => {
            try {
                localStorage.setItem(STORAGE_KEY, String(!prev));
            } catch { /* sem storage, segue o jogo */ }
            return !prev;
        });
    };

    const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.username || "";

    const links = [
        { to: "/", label: "Início", icon: <House size={26} strokeWidth={2.4} />, end: true },
        { to: "/friends", label: "Amigos", icon: <Users size={26} strokeWidth={2.4} /> },
        { to: "/my-profile", label: "Seu perfil", icon: <CircleUserRound size={26} strokeWidth={2.4} /> },
        { to: "/settings", label: "Configurações", icon: <Settings size={26} strokeWidth={2.4} /> },
    ];

    if (isModerator) {
        links.push({ to: "/moderation", label: "Moderação", icon: <ShieldCheck size={26} strokeWidth={2.4} /> });
    }

    return (
        <aside className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`} aria-label="Menu principal">
            <button
                type="button"
                className={styles.toggle}
                onClick={toggle}
                aria-label={expanded ? "Recolher menu" : "Expandir menu"}
                aria-expanded={expanded}
                title={expanded ? "Recolher menu" : "Expandir menu"}
            >
                {expanded ? <PanelLeftClose size={28} /> : <PanelLeftOpen size={28} />}
            </button>

            <div className={styles.profile}>
                <Avatar
                    avatarId={user?.avatarId}
                    name={fullName}
                    size={expanded ? 160 : 60}
                    to="/my-profile"
                />
                {expanded && (
                    <>
                        <p className={styles.name}>{fullName}</p>
                        {isModerator && (
                            <span className={styles.badge}>
                                <ShieldCheck size={18} aria-hidden="true" /> Moderador
                            </span>
                        )}
                    </>
                )}
            </div>

            <NavLink
                to="/explore"
                className={({ isActive }) => `${styles.explore} ${isActive ? styles.exploreActive : ""}`}
                title="Explorar"
            >
                <img src={compassIcon} alt="" width={24} height={22} />
                {expanded && <span>Explorar</span>}
            </NavLink>

            <nav className={styles.nav} aria-label="Navegação">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        title={link.label}
                        aria-label={link.label}
                        className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}
                    >
                        {link.icon}
                        {expanded && <span>{link.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className={styles.bottom}>
                {expanded && suggestions.length > 0 && (
                    <section className={styles.suggestions} aria-label="Sugestões de perfis">
                        <h2>Sugestões</h2>
                        <ul>
                            {suggestions.map((person) => (
                                <li key={person.id}>
                                    <Avatar
                                        avatarId={person.avatarId}
                                        name={person.firstName}
                                        size={52}
                                        to={`/user-profile/${person.id}`}
                                    />
                                    <NavLink to={`/user-profile/${person.id}`} className={styles.suggestionName}>
                                        {person.firstName} {person.lastName}
                                    </NavLink>
                                    <FollowButton
                                        userId={person.id}
                                        following={person.following}
                                        onChange={(value) => setFollowing(person.id, value)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <button type="button" className={styles.logout} onClick={handleLogout} title="Sair">
                    <img src={logoutIcon} alt="" width={30} height={28} />
                    {expanded && <span>Fazer Logout</span>}
                </button>
            </div>
        </aside>
    );
}
