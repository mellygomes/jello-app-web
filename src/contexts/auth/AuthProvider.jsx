import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from "axios";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = user !== null;

    // Valida o usuario logado ao entrar em uma pagina, se o usuário nao estiver autenticado isAuthenticated é falso e ele volta para a pagina de login
    useEffect(() => {
        console.log("OPAAA FUI INVOCADO MESMO HAHA")
        axios.get(
            "http://localhost:8080/api/v1/auth/me",
            {
                withCredentials: true
            }
        )
            .then(response => {
                setUser(response.data.data);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}