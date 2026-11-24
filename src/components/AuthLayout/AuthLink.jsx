import { Link } from "react-router-dom";
import styles from "./auth-layout.module.css";

export default function AuthLink({ content, link, anchor }) {
    return (
        <p className={styles["auth-link"]}>{content} <Link to={link}>{anchor}</Link></p>
    )
}
