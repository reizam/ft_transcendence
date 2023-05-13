import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';
import { IconContext } from 'react-icons';
import { FaQuestion } from 'react-icons/fa';

// interface AchievementsProps {}

function Achievements(/*{}: AchievementsProps*/): ReactElement {
  return (
    <div className={dashStyles.dash__achievements}>
      <h1 className={dashStyles.dash__title}>Achievements (0/7)</h1>
      <div className={dashStyles.ctn__achievements}>
        <div className={dashStyles.achievements__list}>
          <IconContext.Provider value={{ size: '3em' }}>
            <div
              className={dashStyles.achievements__locked}
              data-title="test fds fdsf s dsf sdsfdfs"
            >
              <FaQuestion />
            </div>
            <div
              className={dashStyles.achievements__locked}
              data-title="test fds fdsf s dsf sdsfdfs"
            >
              <FaQuestion />
            </div>
            <div
              className={dashStyles.achievements__locked}
              data-title="test fds fdsf s dsf sdsfdfs"
            >
              <FaQuestion />
            </div>
            <div
              className={dashStyles.achievements__locked}
              data-title="test fds fdsf s dsf sdsfdfs"
            >
              <FaQuestion />
            </div>
            <div
              className={dashStyles.achievements__locked}
              data-title="test fds fdsf s dsf sdsfdfs"
            >
              <FaQuestion />
            </div>
            <div
              className={dashStyles.achievements__locked}
              data-title="test fds fdsf s dsf sdsfdfs"
            >
              <FaQuestion />
            </div>
            <div
              className={dashStyles.achievements__locked}
              data-title="test fds fdsf s dsf sdsfdfs"
            >
              <FaQuestion />
            </div>
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default Achievements;
