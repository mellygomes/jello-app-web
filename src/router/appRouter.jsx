import { Route, Routes } from 'react-router-dom'
import { Home, Login, Register } from '../pages';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export { AppRouter }