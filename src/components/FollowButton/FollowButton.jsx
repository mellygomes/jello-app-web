import { useState } from "react";
import { UserPlus } from "lucide-react";
import { followUser, unfollowUser } from "../../services";
import { useAuth } from "../../hooks/useAuth.js";
import { setFollowing, useFollowState } from "../../hooks/useFollowState.js";
import styles from "./follow-button.module.css";

// Botão Seguir/Seguindo igual ao do Figma. O estado fica num store compartilhado,
// então todos os botões do mesmo usuário na tela mudam juntos.
export default function FollowButton({ userId, following: initial = false, onChange, className = "" }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const following = useFollowState(userId, initial);

    if (!userId || user?.id === userId) return null;

    const toggle = async () => {
        if (loading) return;
        setLoading(true);
        try {
            if (following) {
                await unfollowUser(userId);
            } else {
                await followUser(userId);
            }
            setFollowing(userId, !following);
            onChange?.(!following);
        } catch (error) {
            console.error("Erro ao seguir/deixar de seguir:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            className={`${styles.follow} ${following ? styles.following : ""} ${className}`}
            onClick={toggle}
            disabled={loading}
            aria-pressed={following}
        >
            <span>{following ? "Seguindo" : "Seguir"}</span>
            {!following && <UserPlus size={16} strokeWidth={2.4} aria-hidden="true" />}
        </button>
    );
}
