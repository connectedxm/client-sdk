import React from "react";
import type { QueryClient } from "@tanstack/react-query";

interface ConnectedXMContextValue {
  organizationId: string;
  apiUrl:
    | "https://api.connectedxm.app"
    | "https://staging-api.connectedxm.app"
    | "http://localhost:4001";
  queryClient: QueryClient;
  authToken?: string;
  setAuthToken: (token?: string) => void;
  executeAs?: string;
  locale?: string;
}

export const ConnectedXMContext = React.createContext<ConnectedXMContextValue>(
  {} as ConnectedXMContextValue
);

interface ConnectedXMClientProps {
  children: React.ReactNode;
  organizationId: string;
  queryClient: QueryClient;
  apiUrl?:
    | "https://api.connectedxm.app"
    | "https://staging-api.connectedxm.app"
    | "http://localhost:4001";
  token?: string;
  executeAs?: string;
  locale?: string;
}

export const ConnectedXMClient = ({
  queryClient,
  organizationId,
  apiUrl = "https://api.connectedxm.app",
  token,
  executeAs,
  locale,
  children,
}: ConnectedXMClientProps) => {
  const [authToken, setAuthToken] = React.useState<string | undefined>(token);

  return (
    <ConnectedXMContext.Provider
      value={{
        queryClient,
        organizationId,
        apiUrl,
        authToken,
        setAuthToken,
        executeAs,
        locale,
      }}
    >
      {children}
    </ConnectedXMContext.Provider>
  );
};
