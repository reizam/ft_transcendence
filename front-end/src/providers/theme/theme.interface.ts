import { Dispatch, SetStateAction } from 'react';

export interface ITheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    toggle: string;
  };
}

export interface IThemeContext {
  theme: ITheme;
  setTheme: Dispatch<SetStateAction<ITheme>>;
}

export const ThemeStore: ITheme[] = [
  {
    id: 'default',
    name: 'Pong2000',
    colors: {
      primary: '--main-theme-color',
      secondary: '--main-theme-color',
      toggle: '--toggle-color',
    },
  },
  {
    id: 'rg',
    name: 'R.Garros',
    colors: {
      primary: '--rg-field-color',
      secondary: '--rg-ball-color',
      toggle: '--rg-ball-color',
    },
  },
  {
    id: 'wb',
    name: 'Wimbledon',
    colors: {
      primary: '--wb-field-color',
      secondary: '--wb-ball-color',
      toggle: '--wb-ball-color',
    },
  },
  {
    id: 're',
    name: 'Retro',
    colors: {
      primary: '--re-ball-color',
      secondary: '--re-ball-color',
      toggle: '--toggle-color',
    },
  },
  {
    id: 'ma',
    name: 'Matrix',
    colors: {
      primary: '--ma-ball-color',
      secondary: '--ma-ball-color',
      toggle: '--toggle-color',
    },
  },
];
