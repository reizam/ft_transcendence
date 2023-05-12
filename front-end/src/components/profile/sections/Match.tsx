import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';
import { Game } from '../types/profile.type';

interface GameProps {
  game: Game;
}

function isWinner(player: 1 | 2, game: Game): boolean {
  if (game.playerOneScore > game.playerTwoScore && player === 1) return true;
  if (game.playerOneScore < game.playerTwoScore && player === 2) return true;
  return false;
}

function showScore() {}

function Match({ game }: GameProps): ReactElement {
  if (game.status !== 'finished' || game.players.length != 2) return <></>;

  return (
    <div className={dashStyles.hist__party}>
      <div className={dashStyles.pict__player}>
        <img
          className={dashStyles.img__player}
          src={game.players[0]?.profilePicture}
          alt="PlayerOneAvatar"
        />
      </div>
      <p className={dashStyles.rst__match}>16 - 17</p>
      <div className={dashStyles.pict__player}>
        <img
          className={dashStyles.img__player}
          src="https://cdn.intra.42.fr/users/a2cb081e3eab21713f87e1a938325f68/piboidin.jpg"
          alt=""
        />
      </div>
    </div>
  );
}

export default Match;
