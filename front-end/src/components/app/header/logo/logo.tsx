import React from 'react';
import logoStyles from "./logo.module.css";

function Logo() {
    return (
		<div className={logoStyles.ctn__logo}>
			<h2 className={logoStyles.h2__logo}>Pong</h2>
		</div>
    )
}

export default Logo
