import { createContext } from 'react';

export interface ThemeContextType {
  borderColor: string;
  ballColor: string;
  setBorderColor: (color: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  borderColor: '#df00fe',
  ballColor: '#ffffff',
  setBorderColor: () => {},
});
