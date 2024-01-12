import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
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

export const ConnectedXM = ({
  queryClient,
  organizationId,
  apiUrl = "https://api.connectedxm.app",
  token,
  executeAs,
  locale = "en",
  children,
}: ConnectedXMProps) => {
  const [authToken, setAuthToken] = React.useState<string | undefined>(token);

  return (
    <QueryClientProvider client={queryClient}>
      <Context.Provider
        value={{
          queryClient,
          organizationId,
          apiUrl,
          token: authToken,
          setAuthToken,
          executeAs,
          locale,
        }}
      >
        {children}
      </Context.Provider>
    </QueryClientProvider>
  );
};
