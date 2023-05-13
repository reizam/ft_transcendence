import { GameStats } from '@/components/profile/types/profile.type';
import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';
import { AiFillTrophy } from 'react-icons/ai';
import {
  BsFillHandThumbsDownFill,
  BsFillHandThumbsUpFill,
} from 'react-icons/bs';
import { FaHandshake } from 'react-icons/fa';
import { GiRank1 } from 'react-icons/gi';

interface StatsProps {
  stats: GameStats;
  rank: number;
}

function Stats({ stats, rank }: StatsProps): ReactElement {
  return (
    <div className={dashStyles.dash__statistiques}>
      <h1 className={dashStyles.dash__title}>Statistics</h1>
      <div className={dashStyles.ctn__stats}>
        <div className={dashStyles.ctn__stats__info}>
          <div className={dashStyles.stats__info__logo}>
            <GiRank1 className={dashStyles.info__logo} />
          </div>
          <div className={dashStyles.stats__info__title}>
            <h2>Ranking:</h2>
          </div>
          <div className={dashStyles.stats__info__data}>
            <h3>{rank ?? '?'}</h3>
          </div>
        </div>
        <div className={dashStyles.ctn__stats__info}>
          <div className={dashStyles.stats__info__logo}>
            <AiFillTrophy className={dashStyles.info__logo} />
          </div>
          <div className={dashStyles.stats__info__title}>
            <h2>Elo:</h2>
          </div>
          <div className={dashStyles.stats__info__data}>
            <h3>{stats.elo}</h3>
          </div>
        </div>
        <div className={dashStyles.ctn__stats__info}>
          <div className={dashStyles.stats__info__logo}>
            <BsFillHandThumbsUpFill className={dashStyles.info__logo} />
          </div>
          <div className={dashStyles.stats__info__title}>
            <h2>Win:</h2>
          </div>
          <div className={dashStyles.stats__info__data}>
            <h3>{stats.wins}</h3>
          </div>
        </div>
        <div className={dashStyles.ctn__stats__info}>
          <div className={dashStyles.stats__info__logo}>
            <FaHandshake className={dashStyles.info__logo} />
          </div>
          <div className={dashStyles.stats__info__title}>
            <h2>Draw:</h2>
          </div>
          <div className={dashStyles.stats__info__data}>
            <h3>{stats.draws}</h3>
          </div>
        </div>
        <div className={dashStyles.ctn__stats__info}>
          <div className={dashStyles.stats__info__logo}>
            <BsFillHandThumbsDownFill className={dashStyles.info__logo} />
          </div>
          <div className={dashStyles.stats__info__title}>
            <h2>Loss:</h2>
          </div>
          <div className={dashStyles.stats__info__data}>
            <h3>{stats.losses}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
