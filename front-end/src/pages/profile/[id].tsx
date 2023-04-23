import React from "react";
import Layout from "@/components/app/layouts/Layout";
import ProfileCard from "@/components/app/profile/ProfileCard";
import { useAuth } from "@/providers/auth/auth.context";
import { withProtected } from "@/providers/auth/auth.routes";
import { NextPage } from "next";
import { BACKEND_URL } from "@/constants/env";

interface ProfileCardProps {
    username: string,
    picture: string,
    twoFAIsEnabled: boolean
}


const [id]: NextPage = (props: ProfileCardProps) => {
  return (
    <Layout
      className="flex"
      title="Profile"
    >
      <div className="flex">
          <h1>Profile</h1>
          <h2>{props.username}</h2>
          <h2>{props.picture}</h2>
          <h1>{props.twoFAIsEnabled ? "2FA enable" : "2FA disable"}</h1>
      </div>
    </Layout>
  );
};