import React, { ReactElement } from 'react';
import toggleStyles from '@components/app/toggle/ToggleSwitch.module.css';

interface ToggleSwitchProps {
  initialChecked?: boolean;
  onToggle?: (checked: boolean) => void;
  backgroundColor?: string;
  sliderColor?: string;
  checkedBackgroundColor?: string;
  checked?: boolean;
  isEditing?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  onToggle,
  backgroundColor = '#03001E',
  sliderColor = 'var(--button-background-color-hover)',
  checkedBackgroundColor = '#DF00FE',
  checked = false,
  isEditing = false, // TO DO: Add a different style if editing
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
    </label>
  );
};

export default ToggleSwitch;
