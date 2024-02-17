import React, { Dispatch, SetStateAction } from "react";

export interface ConnectedXMClientContextState {
  organizationId: string;
  apiUrl:
    | "https://client-api.connectedxm.com"
    | "https://staging-client-api.connectedxm.com"
    | "http://localhost:4001";
  token: string | undefined;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  executeAs?: string;
  locale: string;
}

export const ConnectedXMClientContext =
  React.createContext<ConnectedXMClientContextState>(
    {} as ConnectedXMClientContextState
  );

export interface ConnectedXMProviderProps
  extends Omit<ConnectedXMClientContextState, "token" | "setToken"> {
  children: React.ReactNode;
}

export const ConnectedXMProvider = ({
  children,
  ...state
}: ConnectedXMProviderProps) => {
  const [token, setToken] = React.useState<string | undefined>();

  return (
    <ConnectedXMClientContext.Provider
      value={{
        ...state,
        token,
        setToken,
      }}
    >
      {children}
    </ConnectedXMClientContext.Provider>
  );
};
