import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth.js";

export default function ProtectedRoute({ children }) {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}