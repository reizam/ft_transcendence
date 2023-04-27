// ThemeContext.tsx
import { createContext } from "react";

export interface ThemeContextType {
  borderColor: string;
  setBorderColor: (color: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  borderColor: "var(--main-theme-color",
  setBorderColor: () => {},
});
