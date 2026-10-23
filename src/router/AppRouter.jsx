import { Route, Routes } from "react-router-dom";
import { Home, Login, MyProfile, UserProfile, Register } from "../pages";

const AppRouter = () => {
    return (
        <Routes>
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
        </Routes>
    )
}

export { AppRouter }