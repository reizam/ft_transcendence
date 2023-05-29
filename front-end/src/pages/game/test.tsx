import Canvas from '@/components/app/canvas/Canvas';
import Layout from '@/components/app/layouts/Layout';
import ThemeSwitcher from '@/components/app/theme/ThemeSwitcher';
import { withProtected } from '@/providers/auth/auth.routes';
import gameStyles from '@/styles/game.module.css';
import { NextPage } from 'next';

const Game: NextPage = () => {
  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__main__game}>
        <div className={gameStyles.ctn__game}>
          <Canvas />
          <ThemeSwitcher />
        </div>
      </div>
    </Layout>
  );
};

export default withProtected(Game);
