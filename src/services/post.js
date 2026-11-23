import dayjs from "dayjs";
import { api } from "../lib/api.js";

// Monta os params de filtro igual o back espera
export function buildFilterParams(filter = {}) {
    return {
        // o switch da tela diz "mostrar I.A."; o back só sabe esconder (filterAi = true esconde)
        filterAi: filter.showAi ? undefined : true,
        sort: filter.sort && filter.sort !== "RECENT" ? filter.sort : undefined,
        search: filter.search || undefined,
        tags: filter.tags?.length ? filter.tags : undefined,
        initialDate: filter.date?.[0] ? dayjs(filter.date[0]).format("YYYY-MM-DD") : undefined,
        finalDate: filter.date?.[1] ? dayjs(filter.date[1]).format("YYYY-MM-DD") : undefined,
    };
}

export function getExplorePosts(page, size, filter) {
    return api.get("/api/v1/posts/explore", {
        params: { page, size, ...buildFilterParams(filter) },
        paramsSerializer: { indexes: null },
    });
}

export function getFeedPosts(page, size, filter) {
    return api.get("/api/v1/posts/list", {
        params: { page, size, ...buildFilterParams(filter) },
        paramsSerializer: { indexes: null },
    });
}

export function createPost(formData) {
    return api.post("/api/v1/posts/create", formData);
}

export function deletePost(postId) {
    return api.delete(`/api/v1/posts/${postId}`);
}

export function likePost(postId) {
    return api.post(`/api/v1/posts/${postId}/likes`);
}

export function unlikePost(postId) {
    return api.delete(`/api/v1/posts/${postId}/likes`);
}

export function voteAi(postId, ai) {
    return api.put(`/api/v1/posts/${postId}/ai-vote`, { ai });
}

export function removeAiVote(postId) {
    return api.delete(`/api/v1/posts/${postId}/ai-vote`);
}

export function classifyPost(postId, classification) {
    return api.put(`/api/v1/posts/${postId}/classification`, { classification });
}

export function banPost(postId) {
    return api.post(`/api/v1/posts/${postId}/ban`);
}

export function unbanPost(postId) {
    return api.delete(`/api/v1/posts/${postId}/ban`);
}

export function getModerationQueue(page, size) {
    return api.get("/api/v1/posts/moderation/queue", { params: { page, size } });
}

export function getBannedPosts(page, size) {
    return api.get("/api/v1/posts/moderation/banned", { params: { page, size } });
}
