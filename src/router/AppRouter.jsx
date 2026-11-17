import { Route, Routes } from "react-router-dom";
import { Home, Login, Portfolio, MyProfile, UserProfile, Register, PostReport, UserReport } from "../pages";

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
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/posts-reports" element={<PostReport />} />
            <Route path="/users-reports" element={<UserReport />} />
        </Routes>
    )
}

export { AppRouter }