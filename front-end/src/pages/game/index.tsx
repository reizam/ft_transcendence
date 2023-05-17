import Layout from '@/components/app/layouts/Layout';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';
import gameStyles from '@/styles/game.module.css';
import EditButton from '@/components/profile/cards/EditButton';

function Profile(): ReactElement {
  return (
    <Layout title="Dashboard">
      <div className={gameStyles.ctn__pre__game}>
        <div className={gameStyles.ctn__pre__game__canvas}>
          <button className={gameStyles.style__button}>Find a game</button>
          <div style={{ height: '10%', display: 'hidden' }} />
          <button className={gameStyles.style__button}>Create a game</button>
        </div>
      </div>
    </Layout>
  );
}

export default withProtected(Profile);
