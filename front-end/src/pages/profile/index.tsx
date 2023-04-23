import React from "react";
import Layout from "@/components/app/layouts/Layout";
import ProfileCard from "@/components/app/profile/ProfileCard";
import { useAuth } from "@/providers/auth/auth.context";
import { withProtected } from "@/providers/auth/auth.routes";
import { NextPage } from "next";
import { BACKEND_URL } from "@/constants/env";
import { GetServerSideProps } from 'next'

interface ProfileCardProps {
    username: string,
    picture: string,
    twoFAIsEnabled: boolean
}

const Profile: NextPage = (props: ProfileCardProps) => {
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

// export async function getServerSideProps (context) {
export const getServerSideProps: GetServerSideProps = async (context: any) => {
        console.log(context.req.cookies)

    const response = await fetch(`http://back_hostname:3000/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': context.req.cookies.jwt
      }}
    );

    const data = await response.json();

    return (
        {
            props: {
                username: data.ip,
                picture: data.ip,
                twoFAIsEnabled: data.ip,
            }
        }
    );
}

export default withProtected(Profile);
