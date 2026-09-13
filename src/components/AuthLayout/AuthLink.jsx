import styles from "./AuthLayout.module.css";

export default function AuthLink({content, link, anchor}) {
    return (
        <p className={styles["auth-link"]}>{content}<a href={link}>{anchor}</a></p>
    )
}