import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, ThemeProvider } from "./contexts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>,
)
