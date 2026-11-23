import { API_URL, api } from '../lib/api'
import { buildFilterParams } from "./post.js";

// O back troca os bytes da foto mantendo o mesmo id, então o navegador guardava a imagem velha.
// Depois de salvar o perfil a versão sobe e a URL muda.
const IMAGE_VERSION_KEY = "jello:image-version";

function readImageVersion() {
    try {
        return Number(localStorage.getItem(IMAGE_VERSION_KEY)) || 0;
    } catch {
        return 0;
    }
}

let imageVersion = readImageVersion();

export function bumpImageVersion() {
    imageVersion = Date.now();
    try {
        localStorage.setItem(IMAGE_VERSION_KEY, String(imageVersion));
    } catch { /* sem storage, vale só nesta sessão */ }
}

export function getAvatarUrl(avatarId) {
    if (!avatarId) return "";
    return `${API_URL}/api/v1/images/avatars/${avatarId}?v=${imageVersion}`;
}

export function getCoverUrl(coverId) {
    if (!coverId) return "";
    return `${API_URL}/api/v1/images/covers/${coverId}?v=${imageVersion}`;
}

export function getImageUrl(path) {
    if (!path) return "";
    return `${API_URL}${path}`;
}

export function getProfile() {
    return api.get("/api/v1/users/profile");
}

export function getUserProfile(userId) {
    return api.get(`/api/v1/users/${userId}`);
}

export function getAllPostsByUser(userId, page, size, filter = {}) {
    return api.get(`/api/v1/users/${userId}/posts`, {
        params: { page, size, ...buildFilterParams(filter) },
        paramsSerializer: { indexes: null },
    });
}

export async function updateProfile(body) {
    return api.put("/api/v1/users/update", body)
}
