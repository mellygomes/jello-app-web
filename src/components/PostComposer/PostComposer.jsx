import { Send } from "lucide-react";
import Avatar from "../Avatar";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "./post-composer.module.css";

// Faixa azul do topo do Início ("O que se passa na sua mente agora?"). Clicar abre o criar post.
export default function PostComposer({ onClick }) {
    const { user } = useAuth();
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

    return (
        <div className={styles.composer}>
            <Avatar avatarId={user?.avatarId} name={name} size={50} />
            <button type="button" className={styles.prompt} onClick={onClick}>
                O que se passa na sua mente agora?
            </button>
            <button type="button" className={styles.send} onClick={onClick}>
                Postar <Send size={20} aria-hidden="true" />
            </button>
        </div>
    );
}
