import { useEffect, useState } from "react";
import { getTags } from "../services/filter.js";

export function useTags() {

    const [tags, setTags] = useState([]);

    useEffect(() => {
        async function loadTags() {
            try {
                const response = await getTags();
                setTags(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        loadTags();
    }, []);

    return { tags };
}