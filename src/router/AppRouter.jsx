import { useLocation, Route, Routes } from 'react-router-dom'
import { Home, Login, Portfolio, MyProfile, UserProfile, Register, PostReport, UserReport, Feed } from '../pages';
import { NewPostModal } from '../components';

// import ProtectedRoute from '../components/ProtectedRoute.jsx';

const AppRouter = () => {
    const location = useLocation();
    const backgroundLocation = location.state?.backgroundLocation;

    return (
        <>
            <Routes location={backgroundLocation || location}>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route
                path="/my-profile"
                element={
                    // <ProtectedRoute>
                    <MyProfile/>
                    // </ProtectedRoute>
                }
            />
            <Route
                path="/user-profile/:userId"
                element={
                    <UserProfile />
                }
            />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/posts-reports" element={<PostReport />} />
            <Route path="/users-reports" element={<UserReport />} />
            <Route path="/feed" element={<Feed/>}/>
        </Routes>

        {backgroundLocation && (
                <Routes>
                    <Route path="/new-post" element={<NewPostModal />} />
                </Routes>
            )}

        </>
    )
}

export { AppRouter }