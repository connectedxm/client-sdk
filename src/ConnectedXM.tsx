import React from "react";
import Context from "./Context";

interface ConnectedXMProps {
  children: React.ReactNode;
  organizationId: string;
  apiUrl?:
    | "https://api.connectedxm.app"
    | "https://staging-api.connectedxm.app"
    | "http://localhost:4001";
  token?: string;
  executeAs?: string;
  locale?: string;
}

export const ConnectedXM = ({
  organizationId,
  apiUrl = "https://api.connectedxm.app",
  token,
  executeAs,
  locale = "en",
  children,
}: ConnectedXMProps) => {
  const [authToken, setAuthToken] = React.useState<string | undefined>(token);

  return (
    <Context.Provider
      value={{
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
  );
};
