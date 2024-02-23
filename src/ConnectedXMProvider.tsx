import { AxiosError } from "axios";
import React from "react";
import { ConnectedXMResponse } from "./interfaces";

export interface ConnectedXMClientContextState {
  organizationId: string;
  apiUrl:
    | "https://client-api.connectedxm.com"
    | "https://staging-client-api.connectedxm.com"
    | "http://localhost:4001";
  token: string | undefined;
  setToken: (token: string | undefined) => void;
  executeAs: string | undefined;
  setExecuteAs: (accountId: string) => void;
  locale: string;
  onNotAuthorized?: (error: AxiosError<ConnectedXMResponse<any>>) => void;
  onModuleForbidden?: (error: AxiosError<ConnectedXMResponse<any>>) => void;
  onNotFound?: (error: AxiosError<ConnectedXMResponse<any>>) => void;
}

export const ConnectedXMClientContext =
  React.createContext<ConnectedXMClientContextState>(
    {} as ConnectedXMClientContextState
  );

export interface ConnectedXMProviderProps
  extends Omit<
    ConnectedXMClientContextState,
    "token" | "setToken" | "executeAs" | "setExecuteAs"
  > {
  children: React.ReactNode;
}

export const ConnectedXMProvider = ({
  children,
  ...state
}: ConnectedXMProviderProps) => {
  const [token, setToken] = React.useState<string | undefined>();
  const [executeAs, setExecuteAs] = React.useState<string | undefined>();

  return (
    <ConnectedXMClientContext.Provider
      value={{
        ...state,
        token,
        setToken,
        executeAs,
        setExecuteAs,
      }}
    >
      {children}
    </ConnectedXMClientContext.Provider>
  );
};
