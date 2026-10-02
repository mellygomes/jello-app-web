const API_URL = import.meta.env.VITE_API_URL;
import { api } from '../lib/api'

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

export async function updateProfile(body) {
    return api.put('/api/v1/users/update', body)
}