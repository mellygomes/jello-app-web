import { Route, Routes, useLocation } from 'react-router-dom'
import { Home, Login, Portfolio, MyProfile, UserProfile, Register } from '../pages';
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
                <Route path="/my-profile" element={/*<ProtectedRoute>*/<MyProfile/>/* </ProtectedRoute>*/}/>
                <Route path="/user-profile/:userId" element={<UserProfile />}/>
                <Route path='/portfolio' element={<Portfolio />} />
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