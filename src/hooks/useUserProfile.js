import { useEffect, useState } from "react";
import { getAvatarUrl, getCoverUrl, getUserProfile } from "../services";

export function useUserProfile(userId) {

    // guarda de qual usuário é o resultado, assim "carregando" vira uma conta e não um setState no efeito
    const [result, setResult] = useState({ userId: null, profile: null, error: null });

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;

        getUserProfile(userId)
            .then((response) => !cancelled && setResult({ userId, profile: response.data, error: null }))
            .catch((err) => !cancelled && setResult({ userId, profile: null, error: err }));

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const ready = !userId || String(result.userId) === String(userId);
    const profile = userId && ready ? result.profile : null;
    const profileError = !userId
        ? new Error("Identificador de usuário ausente.")
        : ready ? result.error : null;

    // usado pra atualizar o perfil na tela depois de seguir/banir
    const setProfile = (update) => {
        setResult((current) => ({
            ...current,
            profile: typeof update === "function" ? update(current.profile) : update,
        }));
    };

    return {
        profile,
        setProfile,
        profileLoading: Boolean(userId) && !ready,
        profileError,
        avatarUrl: getAvatarUrl(profile?.avatar?.id),
        coverUrl: getCoverUrl(profile?.cover?.id),
    }
}
