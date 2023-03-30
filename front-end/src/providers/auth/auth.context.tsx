import { AuthStatus, IAuthContext } from "@/providers/auth/auth.interface";
import { createContext, useContext, useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";

export const AuthContext = createContext<IAuthContext>({
  logout: () => Promise.resolve(),
  getAccessToken: () => Promise.resolve(null),
  status: "loading",
});

export const useAuth = () => useContext(AuthContext);

export const useProvideAuth = (): IAuthContext => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const getAccessToken = async () => {
    const cookie = getCookie("jwt", {
      sameSite: "strict",
    });

    if (cookie) {
      return cookie.toString();
    }

    return null;
  };

  const logout = async () => {
    setAccessToken(null);
    setStatus("unauthenticated");
    deleteCookie("jwt", {
      sameSite: "strict",
    });
  };

  useEffect(() => {
    const update = async () => {
      const token = await getAccessToken();

      setAccessToken(token || null);
      setStatus(token ? "authenticated" : "unauthenticated");
    };

    update();
  }, [router.pathname]);

  return {
    getAccessToken,
    logout,
    status,
  };
};
