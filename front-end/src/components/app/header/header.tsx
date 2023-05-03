import React from "react";
import Logo from "./logo/logo";
import Title from "./title/title";
import Settings from "./settings/settings";
import headerStyles from "./header.module.css";

interface HeaderProps {
	title?: string;
}

function Header({ title }: HeaderProps) {
    return (
        <header className={headerStyles.ctn__header}>
			<Logo />
			<Title {...{title}} />
			<Settings />
        </header>
    )
}
  
export default Header