import { useCallback, useState } from "react";

const INITIAL = {filterAi: false, tags: [], date: "", search: ""};

export function useFilter(initial = INITIAL) {

    const [draft, setDraft] = useState(initial);
    const [applied, setApplied] = useState(initial);

    const setField = useCallback((name, value) => {
        setDraft((prev) => ({...prev, [name]: value}));
    }, [])

    const apply = useCallback(() => setApplied(draft), [draft]);

    const reset = useCallback(() => {
        setDraft(initial);
        setApplied(initial);
    }, [initial]);

    return {draft, applied, setField, apply, reset};
}