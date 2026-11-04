import { api } from "../lib/api";
import dayjs from "dayjs";

const API_URL = import.meta.env.VITE_API_URL;

export function getAvatarUrl(avatarId) {
  if (!avatarId) return "";
  return `${API_URL}/api/v1/images/avatars/${avatarId}`;
}

export function getCoverUrl(coverId) {
  if (!coverId) return "";
  return `${API_URL}/api/v1/images/covers/${coverId}`;
}

export function getProfile() {
    return api.get("/api/v1/users/profile");
}

export function getUserProfile(userId, { signal } = {}) {
    return api.get(`/api/v1/users/${userId}`, { signal });
}

export function getAllPostsByUser(userId, page, size, filter, { signal } = {}) {
    return api.get(`/api/v1/users/${userId}/posts`, {
        signal,
        params: {
            page,
            size,
            filterAi: filter.filterAi,
            search: filter.search || undefined,
            tags: filter.tags,
            initialDate: filter.date?.[0] ? dayjs(filter.date[0]).format("YYYY-MM-DD") : undefined,
            finalDate: filter.date?.[1] ? dayjs(filter.date[1]).format("YYYY-MM-DD") : undefined,
        },
        paramsSerializer: {
            indexes: null,
        },
    });
}

export async function updateProfile(body) {
    return api.put("/api/v1/users/update", body)
}