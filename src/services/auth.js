import { api } from '../lib/api'

export async function register(data) {
    return await api.post('/api/v1/auth/register', data);
}

export async function logIn(data) {
    return await api.post('/api/v1/auth/login', data);
}

export async function getUserLogged() {
    return await api.get('/api/v1/auth/me');
}