import { useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({children}) {
    const [user, setUser] = useState(() => {
        // Alternativa temporaria para manter o login do usuario com base no localStorage salvo com o token
        // Posteriormente migrar para cookie e mudar o back end tbm
        const token = localStorage.getItem("token");
        return token ? {token} : null;
    });

    const isAuthenticated = user !== null;

    function login(userData) {
        setUser(userData);
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}