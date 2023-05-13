/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import { useAuth } from '@/providers/auth/auth.context';
import { useRouter } from 'next/router';

export function withProtected<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>
) {
  return function WithProtected(props: React.PropsWithChildren<T>) {
    const ProtectedComponent: React.FC<T> = (innerProps) => {
      const router = useRouter();
      const { status } = useAuth();

      React.useEffect(() => {
        if (status === 'unauthenticated') {
          router
            .push('/login', undefined, {
              shallow: true,
            })
            .catch(console.log);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [status]);

      if (status === 'loading' || status === 'unauthenticated') {
        return <LoadingScreen />;
      }

      return <Component {...innerProps} />;
    };

    return <ProtectedComponent {...props} />;
  };
}

export function withPublic<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>
) {
  return function WithPublic(props: React.PropsWithChildren<T>) {
    const PublicComponent: React.FC<T> = (innerProps) => {
      const router = useRouter();
      const { status } = useAuth();

      React.useEffect(() => {
        if (status === 'authenticated') {
          router
            .push('/', undefined, {
              shallow: true,
            })
            .catch(console.log);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [status]);

      if (status === 'loading' || status === 'authenticated') {
        return <LoadingScreen />;
      }

      return <Component {...innerProps} />;
    };

    return <PublicComponent {...props} />;
  };
}
