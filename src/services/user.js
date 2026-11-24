import { api } from "../lib/api.js";

export function getSuggestions(limit = 5) {
    return api.get("/api/v1/users/suggestions", { params: { limit } });
}

export function searchUsers(q) {
    return api.get("/api/v1/users/search", { params: { q } });
}

export function getFollowers(userId) {
    return api.get(`/api/v1/users/${userId}/followers`);
}

export function getFollowing(userId) {
    return api.get(`/api/v1/users/${userId}/following`);
}

export function followUser(userId) {
    return api.post(`/api/v1/follows/${userId}`);
}

export function unfollowUser(userId) {
    return api.delete(`/api/v1/follows/${userId}`);
}

export function banUser(userId) {
    return api.post(`/api/v1/users/${userId}/ban`);
}

export function unbanUser(userId) {
    return api.delete(`/api/v1/users/${userId}/ban`);
}

export function getBannedUsers() {
    return api.get("/api/v1/users/banned");
}

export function deleteAccount(userId) {
    return api.delete(`/api/v1/users/${userId}`);
}
