import { useState, useEffect } from "react";
import { withProtected } from "@/providers/auth/auth.routes";
import { BACKEND_URL } from "@/constants/env";
import LoadingScreen from "../../components/app/screen/LoadingScreen";
import { getCookie } from "cookies-next";

function Profile() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const jwtToken = getCookie("jwt");
  console.log(jwtToken);

  useEffect(() => {
    // setLoading(true);
    fetch(`${BACKEND_URL}/profile`, {
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
  }, []);
  console.log(data);
  if (isLoading) return <LoadingScreen />;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Id: {data.fortytwoId}</p>
      <p>date: {data.createdAt}</p>
    </div>
  );
}

export default withProtected(Profile);
