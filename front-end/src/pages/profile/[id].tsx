import { useState, useEffect } from "react";
import { withProtected } from "@/providers/auth/auth.routes";
import { BACKEND_URL } from "@/constants/env";
import LoadingScreen from "../../components/app/screen/LoadingScreen";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

interface ProfileCardProps {
  username: string;
  picture: string;
  twoFAIsEnabled: boolean;
}

const Post = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const jwtToken = getCookie("jwt");

  console.log("test", id);
  useEffect(() => {
    // setLoading(true);
    // console.log(id);
    if (router.isReady) {
      fetch(BACKEND_URL + "/profile/" + id, {
        method: "GET",
        credentials: "include",
        headers: {
          // Remplacez "Bearer" par `Bearer ${jwtToken}` pour inclure le token JWT dans la requête
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
      <p>{id}</p>
    </div>
  );
};

export default Post;
