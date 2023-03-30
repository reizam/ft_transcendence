import Layout from "@/components/app/layouts/Layout";
import { withProtected } from "@/providers/auth/auth.routes";
import { NextPage } from "next";
import React from "react";

const Home: NextPage = () => {
  return (
    <Layout
      className="flex items-center justify-center h-screen bg-dark-purple"
      title="Home"
    >
      <h1 className="text-white font-medium text-sm">
        Bravo, vous êtes connecté !
      </h1>
    </Layout>
  );
};

export default withProtected(Home);
