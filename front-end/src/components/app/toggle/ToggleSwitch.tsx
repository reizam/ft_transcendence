import React, { ReactElement } from 'react';
import toggleStyles from './ToggleSwitch.module.css';
// import { BACKEND_URL } from '@/constants/env';
// import { getCookie } from 'cookies-next';

// function TwoFASwitch({ checked }: TwoFASwitchProps): ReactElement {
//   const [has2FA, switch2FA] = useState(checked);

//   const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     fetch(`${BACKEND_URL}/profile`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         Authorization: `Bearer ${getCookie('jwt')}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ has2FA }),
//     })
//       .then((res) => res.json())
//       .then((data) => console.log(data))
//       .catch((err) => console.error(err));
//   };
// }

interface ToggleSwitchProps {
  initialChecked?: boolean;
  onToggle?: (checked: boolean) => void;
  backgroundColor?: string;
  sliderColor?: string;
  checkedBackgroundColor?: string;
  checked?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  onToggle,
  backgroundColor = '#03001E',
  sliderColor = 'var(--button-background-color-hover)',
  checkedBackgroundColor = '#DF00FE',
  checked = false,
}): ReactElement => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onToggle) {
      onToggle(e.target.checked);
    }
  };

  return (
    <label className={toggleStyles.switch}>
      <input
        type="checkbox"
        className={toggleStyles.apple__switch}
        style={{
          backgroundColor: checked ? checkedBackgroundColor : backgroundColor,
          boxShadow: checked ? `inset 20px 0 0 0 ${sliderColor}` : undefined,
        }}
        checked={checked}
        onChange={handleChange}
      />
      {/* Two-Factor Authentication */}
    </label>
  );
};

export default ToggleSwitch;
