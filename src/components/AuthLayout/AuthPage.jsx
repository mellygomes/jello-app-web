import Logo from "../Logo";
import styles from "./auth-layout.module.css";

// Casca das telas de login/cadastro: logo no canto + cartão no meio
export default function AuthPage({ variant = "login", children }) {
    return (
        <div className={`${styles["container"]} ${styles[variant] ?? ""}`}>
            <header className={styles["auth-top"]}>
                <Logo size={56} />
            </header>
            <main className={styles["auth-main"]}>
                <div className={styles["auth-container"]}>
                    {children}
                </div>
            </main>
        </div>
    )
}
