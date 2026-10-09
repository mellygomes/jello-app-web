import { Route, Routes } from 'react-router-dom'
import { Home, Login, Portfolio, Profile, Register } from '../pages';
// import ProtectedRoute from '../components/ProtectedRoute.jsx';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>

            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route
                path="/profile"
                element={
                    // <ProtectedRoute>
                    <Profile/>
                    // </ProtectedRoute>
                }
            />
            <Route path='/portfolio' element={<Portfolio />} />
        </Routes>
    )
}

export { AppRouter }