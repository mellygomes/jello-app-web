import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllPostsByUser, getExplorePosts, getSuggestions } from "../services";

const EMPTY = { ready: false, trending: [], pool: [], artists: [] };

// Dados das faixas da vitrine do Explorar. Tudo vem dos endpoints que já existem:
// - em alta: mais curtidos dos últimos 7 dias (hoje + 6 anteriores)
// - pool: posts recentes usados pra montar "estilos" e "ajude a comunidade"
// - artistas: sugestões de quem seguir + as 3 últimas obras de cada um
export function useExploreHighlights(enabled = true) {
    const [data, setData] = useState(EMPTY);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;

        async function load() {
            const [week, pool, suggestions] = await Promise.all([
                getExplorePosts(0, 10, { sort: "POPULAR", date: [dayjs().subtract(6, "day"), null] }).catch(() => null),
                getExplorePosts(0, 50, { sort: "RECENT" }).catch(() => null),
                getSuggestions(6).catch(() => null),
            ]);

            const artists = await Promise.all(
                (suggestions?.data ?? []).map(async (person) => {
                    try {
                        const response = await getAllPostsByUser(person.id, 0, 3, {});
                        return { ...person, works: response.data.content ?? [] };
                    } catch {
                        return { ...person, works: [] };
                    }
                })
            );

            if (cancelled) return;
            setData({
                ready: true,
                trending: week?.data?.content ?? [],
                pool: pool?.data?.content ?? [],
                artists: artists.filter((artist) => artist.works.length > 0),
            });
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [enabled]);

    return data;
}
