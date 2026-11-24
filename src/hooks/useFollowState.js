import { useSyncExternalStore } from "react";

// Guarda quem eu sigo num lugar só, pra todos os botões "Seguir" da tela
// (posts do mesmo autor, sugestões, perfil...) mudarem juntos
const following = new Map();
const listeners = new Set();
let version = 0;

function emit() {
    version += 1;
    listeners.forEach((listener) => listener());
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function setFollowing(userId, value) {
    if (following.get(userId) === value) return;
    following.set(userId, value);
    emit();
}

// guarda o valor que veio da API só se ainda não temos um mais novo
export function seedFollowing(userId, value) {
    if (value === undefined || following.has(userId)) return;
    following.set(userId, value);
}

export function onFollowChange(listener) {
    return subscribe(listener);
}

const getVersion = () => version;

export function useFollowState(userId, initial = false) {
    useSyncExternalStore(subscribe, getVersion);
    return following.has(userId) ? following.get(userId) : initial;
}
