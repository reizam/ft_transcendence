import React, { useContext } from 'react';
import logoStyles from "./logo.module.css";
import { ThemeContext } from '@/pages/ThemeContext';

const Logo: React.FC = () => {
	const { borderColor } = useContext(ThemeContext);

    return (
		<div 
			className={logoStyles.ctn__logo}
		>
			<h2
				className={logoStyles.h2__logo}
				style={{
					color: borderColor,
					textShadow: `0 0 10px ${borderColor}, 0 0 20px ${borderColor}, 0 0 40px ${borderColor}, 0 0 80px ${borderColor}, 0 0 120px ${borderColor}`
				}}
			>
				Pong
			</h2>
		</div>
    );
};

export default Logo
