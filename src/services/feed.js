import { api } from '../lib/api.js';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export function getAvatarUrl(avatarId) {
    if (!avatarId) return '';
    return `${API_URL}/api/v1/images/avatars/${avatarId}`;
}

export function getFeedPosts(page = 0, size = 20) {
    return api.get('/api/v1/posts/list', {
        params: { page, size },
    });
}

export function getCurrentProfile() {
    return api.get('/api/v1/users/profile');
}

export function likePost(postId) {
    return api.post(`/api/v1/posts/${postId}/likes`);
}

export function unlikePost(postId) {
    return api.delete(`/api/v1/posts/${postId}/likes`);
}
