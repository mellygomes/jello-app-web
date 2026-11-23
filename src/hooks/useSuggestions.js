import { useCallback, useEffect, useRef, useState } from "react";
import { getSuggestions } from "../services";
import { onFollowChange } from "./useFollowState.js";

// Sugestões de quem seguir. Quando a pessoa segue alguém (em qualquer lugar da tela)
// a lista é buscada de novo e entra uma sugestão nova no lugar.
export function useSuggestions(limit = 4, enabled = true) {
    const [suggestions, setSuggestions] = useState([]);
    const timer = useRef(null);

    const load = useCallback(() => {
        return getSuggestions(limit)
            .then((response) => setSuggestions(response.data ?? []))
            .catch((error) => console.error("Erro ao carregar sugestões:", error));
    }, [limit]);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;
        getSuggestions(limit)
            .then((response) => !cancelled && setSuggestions(response.data ?? []))
            .catch((error) => console.error("Erro ao carregar sugestões:", error));

        // espera um instante pra pessoa ver o "Seguindo" antes de a sugestão trocar
        const stop = onFollowChange(() => {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => !cancelled && load(), 900);
        });

        return () => {
            cancelled = true;
            clearTimeout(timer.current);
            stop();
        };
    }, [limit, enabled, load]);

    const setFollowing = useCallback((userId, following) => {
        setSuggestions((current) =>
            current.map((item) => (item.id === userId ? { ...item, following } : item))
        );
    }, []);

    return { suggestions, setFollowing };
}
