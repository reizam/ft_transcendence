import Layout from "@/components/app/layouts/Layout";
import { useAuth } from "@/providers/auth/auth.context";
import { withProtected } from "@/providers/auth/auth.routes";
import { NextPage } from "next";
import React from "react";

const Home: NextPage = () => {
  const { logout } = useAuth();

  return (
    <Layout
      className="flex items-center justify-center h-screen bg-dark-purple"
      title="Home"
    >
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-white font-medium text-sm">
          Bravo, vous êtes connecté !
        </h1>
        <button
          onClick={logout}
          className="w-32 h-12 bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75  rounded-full text-white font-medium text-sm transition ease-in-out duration-200"
        >
          Déconnexion
        </button>
      </div>
    </Layout>
  );
};

export default withProtected(Home);
