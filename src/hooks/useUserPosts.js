import { useEffect, useState } from "react";
import { getAllPostsByUser } from "../services/profile.js";

export function useUserPosts(userId, page, pageSize, filter) {
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!userId) return;

        const load = async () => {
            try {
                setLoading(true);
                const response = await getAllPostsByUser(userId, page - 1, pageSize, filter);
                setPosts(response.data.content);
                setTotal(response.data.totalElements);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [userId, page, pageSize, filter]);

    return { posts, total, loading, error };
}