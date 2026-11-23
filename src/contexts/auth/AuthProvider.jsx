import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from "axios";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = user !== null;

    useEffect(() => {
        axios.get(
            "http://localhost:8080/api/v1/auth/me",
            {
                withCredentials: true
            }
        )
            .then(response => {
                setUser(response.data?.id ? response.data : null);
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