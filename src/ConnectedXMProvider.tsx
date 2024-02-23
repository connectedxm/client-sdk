import { AxiosError } from "axios";
import React from "react";
import { ConnectedXMResponse } from "./interfaces";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface ConnectedXMClientContextState {
  queryClient: QueryClient;
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

export const ConnectedXMClientContext = React.createContext<
  Omit<ConnectedXMClientContextState, "queryClient">
>({} as Omit<ConnectedXMClientContextState, "queryClient">);

export interface ConnectedXMProviderProps
  extends Omit<
    ConnectedXMClientContextState,
    "token" | "setToken" | "executeAs" | "setExecuteAs"
  > {
  children: React.ReactNode;
}

export const ConnectedXMProvider = ({
  queryClient,
  children,
  ...state
}: ConnectedXMProviderProps) => {
  const [ssr, setSSR] = React.useState<boolean>(true);
  const [token, setToken] = React.useState<string | undefined>();
  const [executeAs, setExecuteAs] = React.useState<string | undefined>();

  React.useEffect(() => {
    setSSR(false);
  }, []);

  const render = () => {
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

  // prettier-ignore
  if (ssr) return <QueryClientProvider client={queryClient}>{render()}</QueryClientProvider>
  else return render();
};
