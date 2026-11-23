import { useState } from "react";
import { Bot, Palette } from "lucide-react";
import { removeAiVote, voteAi } from "../../services";
import styles from "./ai-vote-panel.module.css";

// Votação da comunidade: "parece IA" ou "arte humana" (um voto por usuário)
export default function AiVotePanel({ postId, votes, onChange, disabled }) {
    const [loading, setLoading] = useState(false);

    const current = votes ?? { ai: 0, human: 0, myVote: null };

    const handleVote = async (ai) => {
        if (loading || disabled) return;
        setLoading(true);
        try {
            // clicar no mesmo voto de novo tira o voto
            const response = current.myVote === ai ? await removeAiVote(postId) : await voteAi(postId, ai);
            onChange?.(response.data);
        } catch (error) {
            console.error("Erro ao votar:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} role="group" aria-label="Votação: essa arte é feita por IA?">
            <span className={styles.label}>Essa arte parece ser de IA?</span>

            <button
                type="button"
                className={`${styles.vote} ${styles.ai} ${current.myVote === true ? styles.active : ""}`}
                onClick={() => handleVote(true)}
                disabled={loading || disabled}
                aria-pressed={current.myVote === true}
            >
                <Bot size={17} aria-hidden="true" /> Parece IA <strong>{current.ai}</strong>
            </button>

            <button
                type="button"
                className={`${styles.vote} ${styles.human} ${current.myVote === false ? styles.active : ""}`}
                onClick={() => handleVote(false)}
                disabled={loading || disabled}
                aria-pressed={current.myVote === false}
            >
                <Palette size={17} aria-hidden="true" /> Arte humana <strong>{current.human}</strong>
            </button>
        </div>
    );
}
