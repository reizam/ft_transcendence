import { useState, useEffect } from 'react'
import { withProtected } from "@/providers/auth/auth.routes";
import { BACKEND_URL } from "@/constants/env";
import LoadingScreen from '../../components/app/screen/LoadingScreen';
import { getCookie } from "cookies-next";

function Profile() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const jwtToken = getCookie('jwt');
  console.log(jwtToken);

  useEffect(() => {
    setLoading(true)
    fetch(`${BACKEND_URL}/profile`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <LoadingScreen/>
  if (!data) return <p>No profile data</p>

  return (
    <div>
      <h1>{data.username}</h1>
      <p>paragraph</p>
    </div>
  )
}

export default withProtected(Profile);