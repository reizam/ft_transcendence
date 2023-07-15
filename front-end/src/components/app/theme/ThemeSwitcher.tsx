import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import { useTheme } from '@/providers/theme/theme.context';
import {
  ITheme,
  IThemeContext,
  ThemeStore,
} from '@/providers/theme/theme.interface';
import gameStyles from '@/styles/game.module.css';
import { ReactElement, useState } from 'react';

const ThemeSwitcher = (): ReactElement => {
  const { theme, setTheme }: IThemeContext = useTheme();
  const [activeToggle, setActiveToggle] = useState<string>(theme.id);

  const handleToggle = (theme: ITheme, checked: boolean): void => {
    if (checked) {
      setActiveToggle(theme.id);
      setTheme(theme);
    } else {
      setActiveToggle('default');
      setTheme(ThemeStore[0]);
    }
  };

  return (
    <div className={gameStyles.ctn__select__theme}>
      <div className={gameStyles.ctn_box_title}>
        <div className={gameStyles.box_theme}>Themes</div>
      </div>
      {Object.entries(ThemeStore).map(([key, theme]) => {
        return (
          <div className={gameStyles.ctn_box} key={key}>
            <div className={gameStyles.box__theme}>
              <div className={gameStyles.name__theme}>{theme.name}</div>
              <div className={gameStyles.toggle__theme}>
                <ToggleSwitch
                  onToggle={(checked): void => handleToggle(theme, checked)}
                  name={key}
                  backgroundColor="var(--toggle-color)"
                  checkedBackgroundColor={'var(' + theme.colors.toggle + ')'}
                  sliderColor={'var(' + theme.colors.primary + ')'}
                  checked={activeToggle === theme.id}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
