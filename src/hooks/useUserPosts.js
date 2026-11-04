import { useEffect, useState } from "react";
import { getAllPostsByUser } from "../services";

export function useUserPosts(userId, page, pageSize, filter) {
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!userId) {
            setPosts([]);
            setTotal(0);
            setLoading(false)
            setError(null)
            return;
        }

        const controller = new AbortController();

        async function loadPosts()  {
            setLoading(true);
            setError(null);

            try {
                const response = await getAllPostsByUser(
                    userId,
                    page - 1,
                    pageSize,
                    filter,
                    { signal: controller.signal }
                );

                setPosts(response.data.content ?? []);
                setTotal(response.data.totalElements ?? 0);
                console.log(response.data.content);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError(error);
                    setPosts([]);
                    setTotal(0);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadPosts();

        return () => controller.abort();
    }, [userId, page, pageSize, filter]);

    return { posts, total, loading, error };
}