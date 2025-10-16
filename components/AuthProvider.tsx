// app/components/AuthProvider.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  // CRÍTICO: Envuelve todo el contenido con SessionProvider
  return <SessionProvider>{children}</SessionProvider>; 
};

export default AuthProvider;