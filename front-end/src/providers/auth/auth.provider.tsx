import React from 'react';
import { AuthContext, useProvideAuth } from '@/providers/auth/auth.context';

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const value = useProvideAuth();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
