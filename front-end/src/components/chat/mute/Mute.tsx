import muteStyles from '@/components/chat/mute/mute.module.css';
import { ReactElement, useEffect } from 'react';
import { IChatUser } from '@/api/channel/channel.types';
import { ImCross } from 'react-icons/im';

interface MuteProps {
  user: IChatUser;
  isVisible: boolean;
  valueInMinutes: string;
  setMuteInMinutes: React.Dispatch<React.SetStateAction<string>>;
  onClick: () => void;
  onClose: () => void;
}

function Mute({
  user,
  isVisible,
  valueInMinutes,
  setMuteInMinutes,
  onClick,
  onClose,
}: MuteProps): ReactElement {
  if (!isVisible) return <></>;

  const handleClose = (e: any) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMuteInMinutes(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onClick();
  };

  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleWindowKeyDown);
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
    };
  }, [onClose]);

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
            id="muteForm"
            type="number"
            placeholder="--"
            className={muteStyles.style_input}
            value={valueInMinutes}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={muteStyles.ctn_validation}>
          <button className={muteStyles.style_button} onClick={onClick}>
            Validate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Mute;
