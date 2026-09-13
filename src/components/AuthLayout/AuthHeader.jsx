import styles from "./AuthLayout.module.css";

export default function AuthHeader({icon, alt, title, description}) {
    return (
        <>
            <img src={icon} alt={alt} className={styles['auth-icon']}/>
            <p className={styles['auth-title']}>{title}</p>
            <p className={styles['auth-description']}>{description}</p>
        </>
    )
}