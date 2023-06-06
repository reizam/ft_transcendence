import { useTheme } from '@/providers/theme/theme.context';

const useColors = (): { [key: string]: string } => {
  const { theme } = useTheme();

  const colorPalette: { [key: string]: string } = {};

  Object.entries(theme.colors).forEach(([key, value]) => {
    colorPalette[key] = getComputedStyle(
      document.documentElement
    ).getPropertyValue(value);
  });

  return colorPalette;
};

export default useColors;
