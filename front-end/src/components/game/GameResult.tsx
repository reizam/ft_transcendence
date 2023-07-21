import dashStyles from '@/styles/dash.module.css';
import gameStyles from '@/styles/game.module.css';

interface GameResultProps {
  winner: {
    id: number;
    username: string;
    profilePicture: string;
  };
}

export const GameResult = ({ winner }: GameResultProps): JSX.Element => {
  return (
    <div className={gameStyles.ctn__result}>
      <div className={gameStyles.ctn__result_img}>
        <picture>
          <img
            className={dashStyles.img__prof}
            src={winner.profilePicture}
            alt="Winner picture"
          />
        </picture>
      </div>
      <div className={gameStyles.ctn__result_txt}>
        <div className={gameStyles.ctn__result_txt_title}>
          <h2 className={gameStyles.result_h2}>{winner.username}</h2>
        </div>
        <div className={gameStyles.ctn__result_txt_text}>
          <p> has won the game!</p>
        </div>
      </div>
    </div>
  );
};
