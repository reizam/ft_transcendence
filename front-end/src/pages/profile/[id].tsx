import { useState, useEffect } from "react";
import { withProtected } from "@/providers/auth/auth.routes";
import { BACKEND_URL } from "@/constants/env";
import LoadingScreen from "../../components/app/screen/LoadingScreen";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

interface IData {
  fortytwoId: number,
  createdAt: string,
  username: string,
  has2FA: false,
}

const Profile = () => {
  const [data, setData] = useState<IData>({fortytwoId: 0, createdAt: "", username: "", has2FA: false});
  const [isLoading, setLoading] = useState(true);
  const jwtToken = getCookie("jwt");
  
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setLoading(true);
    if (router.isReady) {
      fetch(BACKEND_URL + "/profile/" + id, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        });
    }
  }, [router.isReady]);




  if (isLoading) return <LoadingScreen />;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>fortytwoId: {data.fortytwoId}</p>
      <p>createdAt: {data.createdAt}</p>
      <p>username: {data.username}</p>
      <p>has2FA: {data.has2FA ? "enabled" : "disabled"}</p>
    </div>
  );
};

export default Profile;
