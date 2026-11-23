import { useCallback, useState } from "react";

const INITIAL = {filterAi: false, showAi: false, sort: "RECENT", tags: [], date: "", search: ""};

export function useFilter(initial = INITIAL) {

    const [draft, setDraft] = useState(initial);
    const [applied, setApplied] = useState(initial);

    const setField = useCallback((name, value) => {
        setDraft((prev) => ({...prev, [name]: value}));
    }, [])

    // aplica o rascunho (ou um valor já pronto, quando precisa aplicar na hora)
    const apply = useCallback((next) => setApplied(next && "sort" in next ? next : draft), [draft]);

    const reset = useCallback(() => {
        setDraft(initial);
        setApplied(initial);
    }, [initial]);

    return {draft, applied, setField, apply, reset};
}
