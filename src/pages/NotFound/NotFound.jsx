import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <main className={styles.page}>
            <Logo size={56} />
            <h1>Página não encontrada</h1>
            <p>O endereço que você abriu não existe ou foi movido.</p>
            <Link to="/" className={styles.button}>Voltar ao início</Link>
        </main>
    );
}
