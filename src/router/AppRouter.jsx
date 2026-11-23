import { Navigate, Route, Routes } from "react-router-dom";
import {
    Explore,
    Feed,
    Friends,
    Login,
    Moderation,
    MyProfile,
    NotFound,
    Portfolio,
    PostReport,
    Register,
    Settings,
    UserProfile,
    UserReport
} from "../pages";
import { ProtectedRoute } from "../components";
import { useAuth } from "../hooks";

// Quem já está logado não precisa ver login/cadastro de novo
function GuestRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;
    if (isAuthenticated) return <Navigate to="/" replace />;

    return children;
}

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/feed" element={<Navigate to="/" replace />} />

            <Route path="/register" element={<GuestRoute><Register/></GuestRoute>}/>
            <Route path="/login" element={<GuestRoute><Login/></GuestRoute>}/>

            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/my-profile" element={<ProtectedRoute><UserProfile own /></ProtectedRoute>} />
            <Route path="/my-profile/edit" element={<ProtectedRoute><MyProfile/></ProtectedRoute>} />
            <Route path="/user-profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
            <Route path="/portfolio/:userId" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />

            <Route path="/moderation" element={<ProtectedRoute moderatorOnly><Moderation /></ProtectedRoute>} />
            <Route path="/posts-reports" element={<ProtectedRoute moderatorOnly><PostReport /></ProtectedRoute>} />
            <Route path="/users-reports" element={<ProtectedRoute moderatorOnly><UserReport /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export { AppRouter }
