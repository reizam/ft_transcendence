import Canvas from '@/components/app/canvas/Canvas';
import Layout from '@/components/app/layouts/Layout';
import ThemeSwitcher from '@/components/app/theme/ThemeSwitcher';
import { withProtected } from '@/providers/auth/auth.routes';
import { useTheme } from '@/providers/theme/theme.context';
import { IThemeContext } from '@/providers/theme/theme.interface';
import gameStyles from '@/styles/game.module.css';
import { NextPage } from 'next';

const Game: NextPage = () => {
  const { theme }: IThemeContext = useTheme();
  const primaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue(theme.colors.primary);
  const secondaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue(theme.colors.secondary);

  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__main__game}>
        <div className={gameStyles.ctn__game}>
          {/* <Canvas /> */}
          <div className={gameStyles.ctn__canvas}>
            <div
              className={gameStyles.ctn__game__canvas}
              style={{
                borderColor: primaryColor,
                boxShadow: `0 0 1px ${primaryColor}, 0 0 2px ${primaryColor}, 0 0 4px ${primaryColor}, 0 0 8px ${primaryColor}, 0 0 12px ${primaryColor}`,
              }}
            >
              <div className={gameStyles.ctn__countdown}>
                <button className={gameStyles.style__button}>
                  Countdown over!
                </button>
              </div>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </Layout>
  );
};

export default withProtected(Game);
