import { Link } from "react-router-dom";
import styles from "./logo.module.css";

export default function Logo({ size = 48, to = "/", className = "" }) {
    return (
        <Link to={to} className={`${styles.logo} ${className}`} aria-label="JelloArt - Início">
            <img src="/jellyfish.png" alt="" width={size} height={size} />
            <span style={{ fontSize: `${Math.round(size * 0.5)}px` }}>JelloArt</span>
        </Link>
    );
}
