import Canvas from '@/components/app/canvas/Canvas';
import Layout from '@/components/app/layouts/Layout';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import { ThemeContext } from '@/pages/ThemeContext';
import { withProtected } from '@/providers/auth/auth.routes';
import gameStyles from '@/styles/game.module.css';
import { NextPage } from 'next';
import { useState } from 'react';

const Game: NextPage = () => {
  const [activeToggle, setActiveToggle] = useState<number | null>(0);
  const [borderColor, setBorderColor] = useState<string>(
    'var(--main-theme-color)'
  );

  const handleToggle = (
    index: number,
    checked: boolean,
    checkedColor: string
  ): void => {
    if (checked) {
      setActiveToggle(index);
      setBorderColor(checkedColor);
    } else {
      setActiveToggle(0);
      setBorderColor('var(--main-theme-color)');
    }
  };

  return (
    <ThemeContext.Provider value={{ borderColor, setBorderColor }}>
      <Layout title="Game">
        <div className={gameStyles.ctn__main__game}>
          <div className={gameStyles.ctn__game}>
            <Canvas />
            <div className={gameStyles.ctn__select__theme}>
              <h3 className={gameStyles.cnt__theme__h3}>Themes</h3>
              <div className={gameStyles.box__theme}>
                <div className={gameStyles.name__theme}>Classic</div>
                <div className={gameStyles.toggle__theme}>
                  <ToggleSwitch
                    onToggle={(checked) =>
                      handleToggle(0, checked, 'var(--main-theme-color)')
                    }
                    backgroundColor="var(--toggle-color)"
                    checkedBackgroundColor="var(--main-theme-color)"
                    sliderColor="var(--button-background-color-hover)"
                    checked={activeToggle === 0}
                  />
                </div>
              </div>
              <div className={gameStyles.box__theme}>
                <div className={gameStyles.name__theme}>R.Garros</div>
                <div className={gameStyles.toggle__theme}>
                  <ToggleSwitch
                    onToggle={(checked) =>
                      handleToggle(1, checked, 'var(--rg-field-color)')
                    }
                    backgroundColor="var(--toggle-color)"
                    checkedBackgroundColor="var(--rg-ball-color)"
                    sliderColor="var(--rg-field-color)"
                    checked={activeToggle === 1}
                  />
                </div>
              </div>
              <div className={gameStyles.box__theme}>
                <div className={gameStyles.name__theme}>Wimbledon</div>
                <div className={gameStyles.toggle__theme}>
                  <ToggleSwitch
                    onToggle={(checked) =>
                      handleToggle(2, checked, 'var(--wb-field-color)')
                    }
                    backgroundColor="var(--toggle-color)"
                    checkedBackgroundColor="var(--wb-ball-color)"
                    sliderColor="var(--wb-field-color)"
                    checked={activeToggle === 2}
                  />
                </div>
              </div>
              <div className={gameStyles.box__theme}>
                <div className={gameStyles.name__theme}>Retro</div>
                <div className={gameStyles.toggle__theme}>
                  <ToggleSwitch
                    onToggle={(checked) =>
                      handleToggle(3, checked, 'var(--re-ball-color)')
                    }
                    backgroundColor="var(--toggle-color)"
                    checkedBackgroundColor="var(--re-ball-color)"
                    sliderColor="var(--re-field-color)"
                    checked={activeToggle === 3}
                  />
                </div>
              </div>
              <div className={gameStyles.box__theme}>
                <div className={gameStyles.name__theme}>Matrix</div>
                <div className={gameStyles.toggle__theme}>
                  <ToggleSwitch
                    onToggle={(checked) =>
                      handleToggle(4, checked, 'var(--ma-ball-color)')
                    }
                    backgroundColor="var(--toggle-color)"
                    checkedBackgroundColor="var(--ma-ball-color)"
                    sliderColor="var(--ma-field-color)"
                    checked={activeToggle === 4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ThemeContext.Provider>
  );
};

export default withProtected(Game);
