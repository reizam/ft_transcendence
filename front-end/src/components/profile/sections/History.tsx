import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';
import { Game } from '../types/profile.type';
import Match from './Match';

interface HistoryProps {
  matchHistory: Game[];
}

function History({ matchHistory }: HistoryProps): ReactElement {
  const games = matchHistory
    .filter((game) => game.status === 'finished')
    .slice(-5)
    .reverse();

  return (
    <div className={dashStyles.dash__data}>
      <h1 className={dashStyles.dash__title}>Match History</h1>
      {games.map((game) => (
        <Match game={game} key={game.id} />
      ))}
    </div>
  );
}

export default History;
