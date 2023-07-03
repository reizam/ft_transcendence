import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineAim } from 'react-icons/ai';
import { FaQuestion } from 'react-icons/fa';
import { TbPingPong } from 'react-icons/tb';
import { IoSpeedometerOutline } from 'react-icons/io5';
import {
  GiLightningMask,
  GiRobotGolem,
  GiStrongMan,
  GiVacuumCleaner,
} from 'react-icons/gi';

interface AchievementsProps {
  achievements: string[];
}

type achievementPair = {
  infos: string;
  icon: ReactElement;
};

function loadAchievements(
  achievements: string[],
  achievementsMap: Map<string, achievementPair>
): ReactElement[] {
  const achievementsArray: ReactElement[] = [];

  achievementsMap.forEach((value, key) => {
    if (
      achievements?.find((elem) => elem.toLowerCase() === key.toLowerCase())
    ) {
      achievementsArray.push(
        <div
          className={dashStyles.achievements__unlocked}
          data-title={`${key.toUpperCase()}: ${value.infos}`}
          key={key}
        >
          {value.icon}
        </div>
      );
    } else {
      achievementsArray.push(
        <div className={dashStyles.achievements__locked} key={key}>
          <FaQuestion />
        </div>
      );
    }
  });
  return achievementsArray;
}

function Achievements({ achievements }: AchievementsProps): ReactElement {
  const achievementsMap: Map<string, achievementPair> = new Map<
    string,
    achievementPair
  >([
    ['Master', { infos: 'Win 42 matches', icon: <GiStrongMan /> }],
    // ['Purist', { infos: 'Win a match without fuses', icon: <TbPingPong /> }],
    // [
    //   'Deceiver',
    //   { infos: 'Win a match using all 3 fuses', icon: <GiLightningMask /> },
    // ],
    [
      'Ninja',
      {
        infos: 'Win a match in less than a minute',
        icon: <IoSpeedometerOutline />,
      },
    ],
    [
      'Professional',
      { infos: 'Win 3 matches in a row', icon: <AiOutlineAim /> },
    ],
    [
      'Perfectionist',
      { infos: 'Win 10 matches in a row', icon: <GiVacuumCleaner /> },
    ],
    ['Terminator', { infos: 'Win a Shutout', icon: <GiRobotGolem /> }],
  ]);
  const achievementsArray: ReactElement[] = loadAchievements(
    achievements,
    achievementsMap
  );

  return (
    <div className={dashStyles.dash__achievements}>
      <h1 className={dashStyles.dash__title}>
        Achievements ({`${achievements?.length}/${achievementsMap.size}`})
      </h1>
      <div className={dashStyles.ctn__achievements}>
        <div className={dashStyles.achievements__list}>
          <IconContext.Provider value={{ size: '3em' }}>
            {achievementsArray}
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default Achievements;
