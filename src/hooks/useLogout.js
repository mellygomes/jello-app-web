import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth.js";
import { logOut } from "../services";

// Encerra a sessão no back (apaga o cookie), limpa o usuário e volta pro login
export function useLogout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return useCallback(async () => {
        try {
            await logOut();
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
        logout();
        navigate("/login", { replace: true });
    }, [logout, navigate]);
}
