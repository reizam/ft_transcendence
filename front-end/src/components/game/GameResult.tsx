import dashStyles from '@/styles/dash.module.css';

interface GameResultProps {
  winner: {
    id: number;
    username: string;
    profilePicture: string;
  };
}

export const GameResult = ({ winner }: GameResultProps): JSX.Element => {
  return (
    <div className="flex flex-wrap">
      <div className="flex justify-center">
        <img
          className={dashStyles.img__prof}
          src={winner.profilePicture}
          alt="Winner picture"
        />
      </div>
      <div className="flex m-auto">
        <h2>{winner.username} has won the game!</h2>
      </div>
    </div>
  );
};
