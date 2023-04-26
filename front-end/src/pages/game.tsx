import React from "react";
import Layout from "@/components/app/layouts/Layout";
import gameStyles from "../styles/game.module.css";
import { withProtected } from "@/providers/auth/auth.routes";
import { NextPage } from "next";


const Game: NextPage = () => {

	return (
		<Layout
			title="Game"
		>
			<div>
				<div className={gameStyles.ctn__main__game}>
					<div className={gameStyles.ctn__game}>
						<div className={gameStyles.ctn__canvas}>
							<div className={gameStyles.ctn__game__canvas}>
								Ceci sera le Jeu
							</div>
							<div className={gameStyles.ctn__game__rslt}>
								Ceci sera le Résultat
							</div>
						</div>
						<div className={gameStyles.ctn__select__theme}>
							<h3>Themes</h3>
							
						</div>
					</div>
				</div>
      		</div>
    	</Layout>
	)
}

export default withProtected(Game);
