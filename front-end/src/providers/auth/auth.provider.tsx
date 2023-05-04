import { AuthContext, useProvideAuth } from '@/providers/auth/auth.context';
import React, { ReactElement } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const value = useProvideAuth();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
