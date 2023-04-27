import React, { use, useState } from 'react';
import toggleStyles from "./ToggleSwitch.module.css";

interface	ToggleSwitchProps {
	initialChecked?: boolean;
	onToggle?: (checked: boolean) => void;
	backgroundColor?: string;
	sliderColor?: string;
	checkedBackgroundColor?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
	initialChecked = false, 
	onToggle,
	backgroundColor = "#03001E",
	sliderColor = "var(--button-background-color-hover)",
	checkedBackgroundColor = "#DF00FE",
}) => {
    const [checked, setChecked] = useState(initialChecked);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(e.target.checked);
		if (onToggle) {
			onToggle(e.target.checked);
		}
	};

	return (
		<label className={toggleStyles.switch} >
			<input
				type="checkbox"
				className={toggleStyles.apple__switch}
				style={{
					backgroundColor: checked ? checkedBackgroundColor : backgroundColor,
					boxShadow: checked
						? `inset 20px 0 0 0 ${sliderColor}`
						: undefined,
				}}
				checked={checked}
				onChange={handleChange}
			/>
		</label>
	);
};

export default ToggleSwitch;
