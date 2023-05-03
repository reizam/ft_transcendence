import Head from "next/head";
import React, { ReactElement } from "react";
import Header from "../header/header";
import Navbar from "../navbar/navbar";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

function Layout({ title, children, className }: LayoutProps): ReactElement {
	if (title === "Connexion") {
		return (
			<>
				<Head>
					<meta charSet="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, shrink-to-fit=no"
					/>
					<title>
						{title ? `${title} - ft_transcendence` : "ft_transcendence"}
					</title>
				</Head>
	
				<main className={className}>{children}</main>
			</>
		);
	} else {
		return (
			<>
				<Head>
					<meta charSet="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, shrink-to-fit=no"
					/>
					<title>
						{title ? `${title} - ft_transcendence` : "ft_transcendence"}
					</title>
				</Head>
			
				<Navbar />
				<Header {...{title}} />
				<main className={className}>{children}</main>
			</>
		);
	}
}

export default Layout;
