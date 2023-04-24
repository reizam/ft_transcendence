import LoadingScreen from "@/components/app/screen/LoadingScreen";
import { useAuth } from "@/providers/auth/auth.context";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withProtected(Component: React.ComponentType<any>) {
  return function WithProtected(props: any) {
    const router = useRouter();
    const { status } = useAuth();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login", undefined, {
          shallow: true,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    if (status === "loading" || status === "unauthenticated") {
      return <LoadingScreen />;
    }

    return <Component {...props} />;
  };
}

export function withPublic<T = any>(Component: React.ComponentType<T>) {
  return function WithPublic(props: T) {
    const router = useRouter();
    const { status } = useAuth();

    useEffect(() => {
      if (status === "authenticated") {
        router.push("/", undefined, {
          shallow: true,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    if (status === "loading" || status === "authenticated") {
      return <LoadingScreen />;
    }

    return <Component {...props} />;
  };
}
