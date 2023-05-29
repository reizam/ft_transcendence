import { IThemeContext, ThemeStore } from '@/providers/theme/theme.interface';
import { createContext, useContext } from 'react';

export const ThemeContext = createContext<IThemeContext>({
  theme: ThemeStore.default,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: () => {},
});

export const useTheme = (): IThemeContext => useContext(ThemeContext);
