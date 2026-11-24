import Sidebar from "../Sidebar";
import Logo from "../Logo";
import styles from "./app-layout.module.css";

// Casca das telas logadas. O fundo é o degradê azul -> rosa do Figma (claro) ou o azul-marinho -> roxo (escuro)
export default function AppLayout({ title, headerExtra, children }) {
    return (
        <div className={styles.shell}>
            <Sidebar />

            <main className={styles.content}>
                <header className={styles.header}>
                    <Logo size={56} />
                    {headerExtra && <div className={styles.extra}>{headerExtra}</div>}
                </header>

                {title && <h1 className={styles.title}>{title}</h1>}

                {children}
            </main>
        </div>
    );
}
