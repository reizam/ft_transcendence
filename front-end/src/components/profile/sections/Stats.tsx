import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';
import { GiRank1 } from 'react-icons/gi';

// interface StatsProps {}

function Stats(/*{}: StatsProps*/): ReactElement {
  return (
    <div className={dashStyles.dash__statistiques}>
      <h1 className={dashStyles.dash__title}>Statistics</h1>
      <div className={dashStyles.ctn__stat}>
        <div className={dashStyles.ctn__stats__info}>
          <div className={dashStyles.stats__info__logo}>
            <GiRank1 className={dashStyles.info__logo} />
          </div>
          <div className={dashStyles.stats__info__title}>
            <h2>Ranking:</h2>
          </div>
          <div className={dashStyles.stats__info__data}>
            <h3>24th</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
