import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, CircleUserRound, LogOut, Settings } from "lucide-react";
import Logo from "../Logo";
import Avatar from "../Avatar";
import { useAuth } from "../../hooks/useAuth.js";
import { useLogout } from "../../hooks/useLogout.js";
import styles from "./top-bar.module.css";

// Barra de cima pras telas sem menu lateral (feed, perfis): navegação + menu da conta com logout
export default function TopBar({ transparent = false }) {
    const { user, isModerator } = useAuth();
    const logout = useLogout();

    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const onClick = (event) => {
            if (!boxRef.current?.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => event.key === "Escape" && setOpen(false);

        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.username || "";

    const links = [
        { to: "/", label: "Início", end: true },
        { to: "/explore", label: "Explorar" },
        { to: "/friends", label: "Amigos" },
    ];
    if (isModerator) links.push({ to: "/moderation", label: "Moderação" });

    return (
        <header className={`${styles.bar} ${transparent ? styles.transparent : ""}`}>
            <Logo size={44} />

            <nav className={styles.nav} aria-label="Navegação principal">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {user ? (
                <div className={styles.account} ref={boxRef}>
                    <button
                        type="button"
                        className={styles.trigger}
                        onClick={() => setOpen((prev) => !prev)}
                        aria-haspopup="menu"
                        aria-expanded={open}
                    >
                        <Avatar avatarId={user.avatarId} name={name} size={38} />
                        <span className={styles.name}>{name}</span>
                        <ChevronDown size={18} aria-hidden="true" />
                    </button>

                    {open && (
                        <div className={styles.menu} role="menu">
                            <div className={styles.who}>
                                <strong>{name}</strong>
                                <span>@{user.username}</span>
                            </div>
                            <Link to="/my-profile" role="menuitem" onClick={() => setOpen(false)}>
                                <CircleUserRound size={20} /> Meu perfil
                            </Link>
                            <Link to="/settings" role="menuitem" onClick={() => setOpen(false)}>
                                <Settings size={20} /> Configurações
                            </Link>
                            <button type="button" role="menuitem" onClick={logout}>
                                <LogOut size={20} /> Sair da conta
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/login" className={styles.enter}>Entrar</Link>
            )}
        </header>
    );
}
