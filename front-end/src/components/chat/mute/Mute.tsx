import muteStyles from '@/components/chat/mute/mute.module.css';
import { ReactElement } from 'react';
import { IChatUser } from '@/api/channel/channel.types';
import { ImCross } from 'react-icons/im';

interface MuteProps {
  user: IChatUser;
  isVisible: boolean;
  onClose: () => void;
}

function Mute({ onClose, isVisible, user }: MuteProps): ReactElement {
  if (!isVisible) return <></>;

  const handleClose = (e: any) => {
    if (e.target.id === 'wrapper') onClose();
  };

  return (
    <div className={muteStyles.ctn_pck_box} id="wrapper" onClick={handleClose}>
      <div className={muteStyles.ctn_box}>
        <div className={muteStyles.ctn_header}>
          <div className={muteStyles.ctn_escape}>
            <button onClick={() => onClose()}>
              <ImCross />
            </button>
          </div>
          <div className={muteStyles.ctn_title}>
            <h2 className={muteStyles.style_h2}>Mute</h2>
          </div>
        </div>
        <div className={muteStyles.ctn_presentation}>
          <p className={muteStyles.style_text}>
            Please indicate how many minutes you would like to mute :
          </p>
          <p className={muteStyles.style_username}>{user?.username}</p>
        </div>
        <div className={muteStyles.ctn_input}>
          <input
            type="number"
            placeholder="minutes"
            className={muteStyles.style_input}
          />
        </div>
        <div className={muteStyles.ctn_validation}>
          <button className={muteStyles.style_button}>Validate</button>
        </div>
      </div>
    </div>
  );
}

export default Mute;
