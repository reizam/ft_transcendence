import React from "react"
import Logo from "./logo/logo";
import Title from "./title/title";
import Settings from "./settings/settings";

interface HeaderProps {
	title?: string;
}

function Header({ title }: HeaderProps) {
    return (
        <header className="header">
			<Logo />
			<Title {...{title}} />
			<Settings />
        </header>
    )
}
  
export default Header