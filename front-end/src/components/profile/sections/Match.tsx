import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';
import { Game } from '@components/profile/types/profile.type';
import Link from 'next/link';

interface GameProps {
  game: Game;
}

function isWinner(player: 1 | 2, game: Game): boolean {
  if (game.playerOneScore > game.playerTwoScore && player === 1) return true;
  if (game.playerOneScore < game.playerTwoScore && player === 2) return true;
  return false;
}

function showScore(game: Game): ReactElement {
  return (
    <p className={dashStyles.rst__match}>
      {(isWinner(1, game) && <b>{game.playerOneScore}</b>) ||
        (isWinner(2, game) && (
          <small>
            {game.playerOneScore !== -1 ? game.playerOneScore : '><'}
          </small>
        )) ||
        game.playerOneScore}
      {' - '}
      {(isWinner(2, game) && <b>{game.playerTwoScore}</b>) ||
        (isWinner(1, game) && (
          <small>
            {game.playerTwoScore !== -1 ? game.playerTwoScore : '><'}
          </small>
        )) ||
        game.playerTwoScore}
    </p>
  );
}

function Match({ game }: GameProps): ReactElement {
  if (game?.status.toLowerCase() !== 'finished' || game?.players?.length != 2)
    return <></>;

  return (
    <div className={dashStyles.hist__party}>
      <div
        className={dashStyles.pict__player}
        data-title={game.players[0]?.username}
      >
        <Link href={`/profile/${game.players[0].id}`}>
          <img
            className={dashStyles.img__player}
            src={game.players[0]?.profilePicture}
            alt={game.players[0]?.username}
          />
        </Link>
      </div>
      {showScore(game)}
      <div
        className={dashStyles.pict__player}
        data-title={game.players[1]?.username}
      >
        <Link href={`/profile/${game.players[1].id}`}>
          <img
            className={dashStyles.img__player}
            src={game.players[1]?.profilePicture}
            alt={game.players[1]?.username}
          />
        </Link>
      </div>
    </div>
  );
}

export default Match;
