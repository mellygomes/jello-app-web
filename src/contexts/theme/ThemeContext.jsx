import { createContext } from "react";

export const ThemeContext = createContext({ mode: "light", resolved: "light", setMode: () => {} });
