import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';

// interface AchievementsProps {}

function Achievements(/*{}: AchievementsProps*/): ReactElement {
  return (
    <div className={dashStyles.dash__achievements}>
      <h1 className={dashStyles.dash__title}>Achievements (3/10)</h1>
    </div>
  );
}

export default Achievements;
