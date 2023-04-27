import React from "react";
import Layout from "@/components/app/layouts/Layout";
import gameStyles from "../styles/game.module.css";
import { withProtected } from "@/providers/auth/auth.routes";
import { NextPage } from "next";
import ToggleSwitch from "@/components/app/toggle/toggle";


const Game: NextPage = () => {
	const handleToggle = (checked: boolean) => {
		console.log("Toggle switch:", checked);
	}

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
							<h3 className={gameStyles.cnt__theme__h3}>Themes</h3>
							<div className={gameStyles.box__theme}>
								<div className={gameStyles.name__theme}>
									Classic
								</div>
								<div className={gameStyles.toggle__theme}>
									<ToggleSwitch
										onToggle={handleToggle}
										backgroundColor="var(--toggle-color)"
										checkedBackgroundColor="var(--main-theme-color)"
										sliderColor="var(--button-background-color-hover)"
									/>
								</div>
							</div>
							<div className={gameStyles.box__theme}>
								<div className={gameStyles.name__theme}>
									R.Garros
								</div>
								<div className={gameStyles.toggle__theme}>
									<ToggleSwitch
										onToggle={handleToggle}
										backgroundColor="var(--toggle-color)"
										checkedBackgroundColor="var(--rg-ball-color)"
										sliderColor="var(--rg-field-color)"
									/>
								</div>
							</div>
							<div className={gameStyles.box__theme}>
								<div className={gameStyles.name__theme}>
									Wimbledon
								</div>
								<div className={gameStyles.toggle__theme}>
									<ToggleSwitch
										onToggle={handleToggle}
										backgroundColor="var(--toggle-color)"
										checkedBackgroundColor="var(--wb-ball-color)"
										sliderColor="var(--wb-field-color)"
									/>
								</div>
							</div>
							<div className={gameStyles.box__theme}>
								<div className={gameStyles.name__theme}>
									Retro
								</div>
								<div className={gameStyles.toggle__theme}>
									<ToggleSwitch
										onToggle={handleToggle}
										backgroundColor="var(--toggle-color)"
										checkedBackgroundColor="var(--re-ball-color)"
										sliderColor="var(--re-field-color)"
									/>
								</div>
							</div>
							<div className={gameStyles.box__theme}>
								<div className={gameStyles.name__theme}>
									Matrix
								</div>
								<div className={gameStyles.toggle__theme}>
									<ToggleSwitch
										onToggle={handleToggle}
										backgroundColor="var(--toggle-color)"
										checkedBackgroundColor="var(--ma-ball-color)"
										sliderColor="var(--ma-field-color)"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
      		</div>
    	</Layout>
	)
}

export default withProtected(Game);
