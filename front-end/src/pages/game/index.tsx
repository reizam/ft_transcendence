import Layout from '@/components/app/layouts/Layout';
import { withProtected } from '@/providers/auth/auth.routes';
import gameStyles from '@/styles/game.module.css';
import Link from 'next/link';
import { ReactElement } from 'react';

function Game(): ReactElement {
  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__pre__game}>
        <div className={gameStyles.ctn__pre__game__canvas}>
          <Link href="/game/test">
            <button className={gameStyles.style__button}>Local mode</button>
          </Link>
          <div style={{ height: '10%', display: 'hidden' }} />
          <Link href="/game/find">
            <button className={gameStyles.style__button}>Find a game</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default withProtected(Game);
