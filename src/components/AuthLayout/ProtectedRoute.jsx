import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";
import Spinner from "../Spinner";

// Só deixa passar quem está logado (e, se pedir, quem é moderador)
export default function ProtectedRoute({ children, moderatorOnly = false }) {

    const { isAuthenticated, isModerator, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p className="page-loading"><Spinner size={22} color="#282828" aria-hidden="true" />&nbsp;Carregando...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (moderatorOnly && !isModerator) {
        return <Navigate to="/" replace />;
    }

    return children;
}
