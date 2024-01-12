import React from "react";
import type { QueryClient } from "@tanstack/react-query";
import Context from "./Context";

interface ConnectedXMProps {
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

const ConnectedXM = ({
  queryClient,
  organizationId,
  apiUrl = "https://api.connectedxm.app",
  token,
  executeAs,
  locale,
  children,
}: ConnectedXMProps) => {
  const [authToken, setAuthToken] = React.useState<string | undefined>(token);

  return (
    <Context.Provider
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
    </Context.Provider>
  );
};

export default ConnectedXM;
