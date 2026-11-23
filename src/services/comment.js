import { api } from "../lib/api.js";

export function getComments(postId) {
    return api.get(`/api/v1/comments/${postId}/all`);
}

export function addComment(postId, comment, parentId) {
    return api.post(`/api/v1/comments/${postId}/add`, { comment, parentId: parentId ?? undefined });
}

export function deleteComment(commentId) {
    return api.delete(`/api/v1/comments/${commentId}`);
}
