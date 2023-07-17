import Layout from '@/components/app/layouts/Layout';
import { withProtected } from '@/providers/auth/auth.routes';
import gameStyles from '@/styles/game.module.css';
import Link from 'next/link';
import { ReactElement } from 'react';
import { FaGamepad } from 'react-icons/fa';
import { RiComputerFill } from 'react-icons/ri';

function Game(): ReactElement {
  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__pre__game}>
        <div className={gameStyles.ctn__pre__game__canvas}>
          <Link href="/game/find">
            <button className={gameStyles.style__button}>
              <div className={gameStyles.style_part_one}>
                Launch a game
              </div>
              <FaGamepad size={24} />
            </button>
          </Link>
          <div style={{ height: '10%', display: 'hidden' }} />
          <Link href="/game/local">
            <button className={gameStyles.style__button}>
              <div className={gameStyles.style_part_one}>
                Local mode
              </div>
              <RiComputerFill  size={24} />
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default withProtected(Game);
