import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { api } from "../../lib/api";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = user !== null;
    const isModerator = Boolean(user?.moderator);

    // Valida o usuario logado ao entrar em uma pagina,
    // se o usuário nao estiver autenticado isAuthenticated é falso e ele volta para a pagina de login
    const refreshUser = useCallback(async () => {
        try {
            const response = await api.get("/api/v1/auth/me");
            setUser(response.data?.id ? response.data : null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        api.get("/api/v1/auth/me")
            .then((response) => !cancelled && setUser(response.data?.id ? response.data : null))
            .catch(() => !cancelled && setUser(null))
            .finally(() => !cancelled && setLoading(false));

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback((userData) => setUser(userData), []);
    const logout = useCallback(() => setUser(null), []);

    const value = useMemo(() => ({
        user,
        isAuthenticated,
        isModerator,
        login,
        logout,
        refreshUser,
        loading
    }), [user, isAuthenticated, isModerator, login, logout, refreshUser, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
