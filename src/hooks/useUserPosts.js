import { useCallback } from "react";
import { getAllPostsByUser } from "../services/profile.js";
import { usePagedPosts } from "./usePagedPosts.js";

export function useUserPosts(userId, page, pageSize, filter) {
    const fetcher = useCallback(
        (pageIndex, size, currentFilter) => getAllPostsByUser(userId, pageIndex, size, currentFilter),
        [userId]
    );

    return usePagedPosts(fetcher, page, pageSize, filter, Boolean(userId), String(userId));
}
