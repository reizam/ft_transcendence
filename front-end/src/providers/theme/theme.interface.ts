import { Dispatch, SetStateAction } from 'react';

export interface ITheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface IThemeContext {
  theme: ITheme;
  setTheme: Dispatch<SetStateAction<ITheme>>;
}

export const ThemeStore: { [id: string]: ITheme } = {
  default: {
    name: 'Pong2000',
    colors: {
      primary: '--main-theme-color',
      secondary: '--button-background-color-hover',
    },
  },
  rg: {
    name: 'R.Garros',
    colors: {
      primary: '--rg-field-color',
      secondary: '--rg-ball-color',
    },
  },
  wb: {
    name: 'Wimbledon',
    colors: {
      primary: '--wb-field-color',
      secondary: '--wb-ball-color',
    },
  },
  re: {
    name: 'Retro',
    colors: {
      primary: '--re-field-color',
      secondary: '--re-ball-color',
    },
  },
  ma: {
    name: 'Matrix',
    colors: {
      primary: '--ma-field-color',
      secondary: '--ma-ball-color',
    },
  },
} as const;
