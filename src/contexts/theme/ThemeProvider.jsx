import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import ptBR from "antd/locale/pt_BR";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = "jello:theme";

function readMode() {
    try {
        return localStorage.getItem(STORAGE_KEY) || "light";
    } catch {
        return "light";
    }
}

const prefersDark = () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

// Tema claro/escuro. mode: "light" | "dark" | "system" (segue o sistema operacional).
// A escolha vale pro navegador todo e continua depois do logout.
export function ThemeProvider({ children }) {
    const [mode, setModeState] = useState(readMode);
    const [systemDark, setSystemDark] = useState(prefersDark);

    useEffect(() => {
        const query = window.matchMedia?.("(prefers-color-scheme: dark)");
        if (!query) return;

        const onChange = (event) => setSystemDark(event.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    const resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode;

    useEffect(() => {
        document.documentElement.dataset.theme = resolved;
    }, [resolved]);

    const setMode = useCallback((next) => {
        setModeState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch { /* sem storage, vale só nesta sessão */ }
    }, []);

    const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);

    return (
        <ThemeContext.Provider value={value}>
            <ConfigProvider
                locale={ptBR}
                theme={{
                    algorithm: resolved === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                    token: { fontFamily: '"Roboto", "Segoe UI", Arial, sans-serif', fontSize: 15, borderRadius: 8 },
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}
