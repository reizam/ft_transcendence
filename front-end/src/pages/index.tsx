import React from "react";
import Layout from "@/components/app/layouts/Layout";
import { withProtected } from "@/providers/auth/auth.routes";
import { NextPage } from "next";

const Home: NextPage = () => {

	return (
		<Layout
			className="flex items-center justify-center h-screen bg-purple"
			title="Home"
		>
			<div className="flex flex-col items-center space-y-8">
				<h1 className="text-white font-medium text-sm">
					Bravo, vous êtes connecté !
				</h1>
			</div>
		</Layout>
	);
};

export default withProtected(Home);
