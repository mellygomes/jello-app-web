import { Link } from "react-router-dom";
import jellyfish from "../../assets/figma/jellyfish.svg";
import { getAvatarUrl } from "../../services";
import styles from "./avatar.module.css";

// Foto de perfil redonda. Sem foto cai na água-viva do Figma
export default function Avatar({ avatarId, src, name = "", size = 40, to, className = "" }) {
    const url = src || getAvatarUrl(avatarId);

    const image = url ? (
        <img src={url} alt={name ? `Foto de ${name}` : ""} className={styles.photo} />
    ) : (
        <span className={styles.fallback}>
            <img src={jellyfish} alt="" style={{ width: "62%", height: "62%" }} />
        </span>
    );

    const box = (
        <span className={`${styles.avatar} ${className}`} style={{ width: size, height: size }}>
            {image}
        </span>
    );

    return to ? <Link to={to} aria-label={name ? `Perfil de ${name}` : "Perfil"}>{box}</Link> : box;
}
