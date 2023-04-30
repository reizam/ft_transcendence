import { useState, useEffect } from "react";
import { withProtected } from "@/providers/auth/auth.routes";
import { BACKEND_URL } from "@/constants/env";
import LoadingScreen from "../../components/app/screen/LoadingScreen";
import { getCookie } from "cookies-next";

interface IData {
  fortytwoId: number;
  createdAt: string;
  username: string;
}

function Dashboard() {
  const [data, setData] = useState<IData>({
    fortytwoId: 0,
    createdAt: "",
    username: "",
  });
  const [isLoading, setLoading] = useState(true);
  const jwtToken = getCookie("jwt");

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (!data) return <p>No dashboard data</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Id: {data.fortytwoId}</p>
      <p>date: {data.createdAt}</p>
      <p>username: {data.username}</p>
    </div>
  );
}

export default withProtected(Dashboard);
