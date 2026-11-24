import styles from "./auth-layout.module.css";

export default function AuthHeader({ icon, alt, title, description }) {
    return (
        <>
            <div className={styles['auth-icon']}>
                <img src={icon} alt={alt} />
            </div>
            <h1 className={styles['auth-title']}>{title}</h1>
            <p className={styles['auth-description']}>{description}</p>
        </>
    )
}
