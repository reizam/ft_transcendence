import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';

// interface HistoryProps {}

function History(/*{}: HistoryProps*/): ReactElement {
  return (
    <div className={dashStyles.dash__data}>
      <h1 className={dashStyles.dash__title}>Match History</h1>
      <div className={dashStyles.hist__party}>
        <div className={dashStyles.hist__party}>
          <div className={dashStyles.pict__player}>
            <img
              className={dashStyles.img__player}
              src="https://cdn.intra.42.fr/users/f7c9f497be15126143ee5a3e2a5d4f82/mlarboul.jpg"
              alt=""
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
      </div>
    </div>
  );
}

export default History;
