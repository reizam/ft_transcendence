import { ThemeContext } from '@/providers/theme/theme.context';
import { ITheme, ThemeStore } from '@/providers/theme/theme.interface';
import { ReactElement, ReactNode, useState } from 'react';

interface ThemeProviderProps {
  children?: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
  const [theme, setTheme] = useState<ITheme>(ThemeStore[0]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
