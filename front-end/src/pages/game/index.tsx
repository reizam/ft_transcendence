import Layout from '@/components/app/layouts/Layout';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';
import gameStyles from '@/styles/game.module.css';
import Button from '@/components/app/button/Button';

function Profile(): ReactElement {
  // TO DO: Mettre le Button dans Profile (pas besoin d'un composant global)

  return (
    <Layout title="Dashboard">
      <div className={gameStyles.ctn__pre__game}>
        <div className={gameStyles.dash__achievements}>
          {/* <h1 className={gameStyles.dash__title}>Achievements</h1> */}
          <Button name="Find a game" />
          <div style={{ height: '10%', display: 'hidden' }} />
          <Button name="Create a game" />
          {/* <button className={''}> Find a game </button> */}
        </div>
      </div>
    </Layout>
  );
}

export default withProtected(Profile);
