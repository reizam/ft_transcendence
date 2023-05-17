import Layout from '@/components/app/layouts/Layout';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import { withProtected } from '@/providers/auth/auth.routes';
import { NextPage } from 'next';
import { useState } from 'react';
import gameStyles from '@/styles/game.module.css';
import Canvas from '@/components/app/canvas/Canvas';
import { ThemeContext } from '@/pages/ThemeContext';

const Game: NextPage = () => {
  const [activeToggle, setActiveToggle] = useState<number | null>(0);
  const [borderColor, setBorderColor] = useState<string>(
    'var(--main-theme-color)'
  );

  const handleToggle = (
    index: number,
    checked: boolean,
    checkedColor: string
  ) => {
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
        <div className={gameStyles.ctn__pre__game__blurred}>
          <div className={gameStyles.ctn__pre__game}>
            <div className={gameStyles.ctn__pre__game__canvas__overlay}>
              LOOKING FOR A PLAYER...
              <div style={{ height: '10%', display: 'hidden' }} />
              <button className={gameStyles.style__button}>
                Invite a friend
              </button>
            </div>
            <div className={gameStyles.ctn__main__game}>
              <div className={gameStyles.ctn__game}>
                <div className={gameStyles.ctn__canvas}>
                  <div
                    className={gameStyles.ctn__game__canvas}
                    style={{
                      borderColor: borderColor,
                      boxShadow: `0 0 1px ${borderColor}, 0 0 2px ${borderColor}, 0 0 4px ${borderColor}, 0 0 8px ${borderColor}, 0 0 12px ${borderColor}`,
                    }}
                  >
                    <Canvas />
                  </div>
                  <div className={gameStyles.ctn__game__rslt}>
                    Ceci sera le Résultat
                  </div>
                </div>
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
          </div>
        </div>
      </Layout>
    </ThemeContext.Provider>
  );
};

export default withProtected(Game);
