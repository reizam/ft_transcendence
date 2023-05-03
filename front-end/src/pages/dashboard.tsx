import Button from '@/components/app/button/Button';
import Layout from '@/components/app/layouts/Layout';
import dashStyles from '@/styles/dash.module.css';
import { NextPage } from 'next';
import { AiFillTrophy } from 'react-icons/ai';
import {
  BsFillHandThumbsDownFill,
  BsFillHandThumbsUpFill,
} from 'react-icons/bs';
import { FaHandshake } from 'react-icons/fa';
import { GiRank1 } from 'react-icons/gi';

const Dashboard: NextPage = () => {
  return (
    <Layout title="Dashboard">
      <div>
        <div className={dashStyles.ctn__dash}>
          <div className={dashStyles.dash__profile}>
            <div className={dashStyles.pict__prof}>
              <img
                className={dashStyles.img__prof}
                src="https://cdn.intra.42.fr/users/f7c9f497be15126143ee5a3e2a5d4f82/mlarboul.jpg"
                alt=""
              />
            </div>
            <h2 className={dashStyles.dash__h2}>Matthieu</h2>
            <h3 className={dashStyles.dash__h3}>LARBOULLET</h3>
            <p className={dashStyles.dash__p}>as</p>
            <h4 className={dashStyles.dash__username}>UncleScr00ge</h4>
            <p className={dashStyles.dash__2FA}>2FAuth: Enabled</p>
            <Button />
            {/* <button className={dashStyles.dash__button}>EDIT</button> */}
          </div>
          <div className={dashStyles.dash__data}>
            <h1 className={dashStyles.dash__title}>Match History</h1>
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
            <div className={dashStyles.hist__party}>
              <div className={dashStyles.pict__player}>
                <img
                  className={dashStyles.img__player}
                  src="https://cdn.intra.42.fr/users/f7c9f497be15126143ee5a3e2a5d4f82/mlarboul.jpg"
                  alt=""
                />
              </div>
              <p className={dashStyles.rst__match}>20 - 13</p>
              <div className={dashStyles.pict__player}>
                <img
                  className={dashStyles.img__player}
                  src="https://cdn.intra.42.fr/users/f9f6e861c01bbc4e5e4ead4615fbcbe0/flohrel.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className={dashStyles.hist__party}>
              <div className={dashStyles.pict__player}>
                <img
                  className={dashStyles.img__player}
                  src="https://cdn.intra.42.fr/users/736968882f4340a00b83bfa9fbcc8bd8/kmazier.jpg"
                  alt=""
                />
              </div>
              <p className={dashStyles.rst__match}>2 - 5</p>
              <div className={dashStyles.pict__player}>
                <img
                  className={dashStyles.img__player}
                  src="https://cdn.intra.42.fr/users/f7c9f497be15126143ee5a3e2a5d4f82/mlarboul.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className={dashStyles.hist__party}>
              <div className={dashStyles.pict__player}>
                <img
                  className={dashStyles.img__player}
                  src="https://cdn.intra.42.fr/users/06cf823c954721e18942bee2dde06b17/jmazoyer.jpg"
                  alt=""
                />
              </div>
              <p className={dashStyles.rst__match}>7 - 7</p>
              <div className={dashStyles.pict__player}>
                <img
                  className={dashStyles.img__player}
                  src="https://cdn.intra.42.fr/users/f7c9f497be15126143ee5a3e2a5d4f82/mlarboul.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className={dashStyles.hist__party}>
              <div className={dashStyles.pict__player}>
                <img
                  className={dashStyles.img__player}
                  src="https://cdn.intra.42.fr/users/f7c9f497be15126143ee5a3e2a5d4f82/mlarboul.jpg"
                  alt=""
                />
              </div>
              <p className={dashStyles.rst__match}>3 - 8</p>
              <div className={dashStyles.pict__player}>
                <img
                  className={dashStyles.img__player}
                  src="https://cdn.intra.42.fr/users/06cf823c954721e18942bee2dde06b17/jmazoyer.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className={dashStyles.dash__statistiques}>
            <h1 className={dashStyles.dash__title}>Statistics</h1>
            <div className={dashStyles.ctn__stat}>
              <div className={dashStyles.ctn__stats__info}>
                <div className={dashStyles.stats__info__logo}>
                  <GiRank1 className={dashStyles.info__logo} />
                </div>
                <div className={dashStyles.stats__info__title}>
                  <h2>Ranking:</h2>
                </div>
                <div className={dashStyles.stats__info__data}>
                  <h3>24th</h3>
                </div>
              </div>
              <div className={dashStyles.ctn__stats__info}>
                <div className={dashStyles.stats__info__logo}>
                  <AiFillTrophy className={dashStyles.info__logo} />
                </div>
                <div className={dashStyles.stats__info__title}>
                  <h2>Trophies:</h2>
                </div>
                <div className={dashStyles.stats__info__data}>
                  <h3>2565</h3>
                </div>
              </div>
              <div className={dashStyles.ctn__stats__info}>
                <div className={dashStyles.stats__info__logo}>
                  <BsFillHandThumbsUpFill className={dashStyles.info__logo} />
                </div>
                <div className={dashStyles.stats__info__title}>
                  <h2>Win:</h2>
                </div>
                <div className={dashStyles.stats__info__data}>
                  <h3>50</h3>
                </div>
              </div>
              <div className={dashStyles.ctn__stats__info}>
                <div className={dashStyles.stats__info__logo}>
                  <FaHandshake className={dashStyles.info__logo} />
                </div>
                <div className={dashStyles.stats__info__title}>
                  <h2>Draw:</h2>
                </div>
                <div className={dashStyles.stats__info__data}>
                  <h3>7</h3>
                </div>
              </div>
              <div className={dashStyles.ctn__stats__info}>
                <div className={dashStyles.stats__info__logo}>
                  <BsFillHandThumbsDownFill className={dashStyles.info__logo} />
                </div>
                <div className={dashStyles.stats__info__title}>
                  <h2>Loss:</h2>
                </div>
                <div className={dashStyles.stats__info__data}>
                  <h3>22</h3>
                </div>
              </div>
            </div>
          </div>
          <div className={dashStyles.dash__achievements}>
            <h1 className={dashStyles.dash__title}>Achievements (3/10)</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
