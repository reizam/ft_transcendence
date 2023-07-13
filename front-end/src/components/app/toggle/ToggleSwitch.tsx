import React, { ReactElement } from 'react';
import toggleStyles from '@components/app/toggle/ToggleSwitch.module.css';

interface ToggleSwitchProps {
  initialChecked?: boolean;
  onToggle?: (checked: boolean) => void;
  name: string;
  backgroundColor?: string;
  sliderColor?: string;
  checkedBackgroundColor?: string;
  checked?: boolean;
  isEditing?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  onToggle,
  name,
  backgroundColor = '#03001E',
  sliderColor = 'var(--button-background-color-hover)',
  checkedBackgroundColor = '#DF00FE',
  checked = false,
  isEditing = false,
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
        name={name}
        className={`${toggleStyles.apple__switch} ${
          isEditing ? toggleStyles.editing__pointer : ''
        }`}
        style={{
          backgroundColor: checked ? checkedBackgroundColor : backgroundColor,
          boxShadow: checked
            ? `inset 20px 0 0 0 ${sliderColor} ${
                isEditing ? ', 0 0 40px 10px var(--main-theme-color)' : ''
              }`
            : `inset -20px 0 0 0 ${sliderColor} ${
                isEditing ? ', 0 0 40px 10px var(--main-theme-color)' : ''
              }`,
        }}
        checked={checked}
        onChange={handleChange}
      />
    </label>
  );
};

export default ToggleSwitch;
