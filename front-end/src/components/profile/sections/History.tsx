import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';
import { Game } from '@components/profile/types/profile.type';
import Match from '@components/profile/sections/Match';

interface HistoryProps {
  matchHistory: Game[];
}

function sortPlayers(games: Game[]): void {
  games.forEach((game) => {
    if (game.playerOneId === game.players[1].id) {
      game.players.reverse();
    }
  });
}
function History({ matchHistory }: HistoryProps): ReactElement {
  const games = matchHistory
    ?.filter((game) => game.status.toLowerCase() === 'finished')
    ?.slice(0, 5);

  sortPlayers(games);
  return (
    <div className={dashStyles.dash__data}>
      <h1 className={dashStyles.dash__title}>Match History</h1>
      {games?.map((game) => (
        <Match game={game} key={game.id} />
      ))}
    </div>
  );
}

export default History;
