import { AxiosError } from "axios";
import React from "react";
import { ConnectedXMResponse } from "./interfaces";
import {
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";

export interface ConnectedXMClientContextState {
  queryClient: QueryClient;
  organizationId: string;
  apiUrl:
    | "https://client-api.connectedxm.com"
    | "https://staging-client-api.connectedxm.com"
    | "http://localhost:4001";
  getToken: () => Promise<string | undefined> | string | undefined;
  getExecuteAs?: () => Promise<string | undefined> | string | undefined;
  locale: string;
  onNotAuthorized?: (
    error: AxiosError<ConnectedXMResponse<any>>,
    key: QueryKey,
    shouldRedirect: boolean
  ) => void;
  onModuleForbidden?: (
    error: AxiosError<ConnectedXMResponse<any>>,
    key: QueryKey,
    shouldRedirect: boolean
  ) => void;
  onNotFound?: (
    error: AxiosError<ConnectedXMResponse<any>>,
    key: QueryKey,
    shouldRedirect: boolean
  ) => void;
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
  queryClient,
  children,
  ...state
}: ConnectedXMProviderProps) => {
  const [ssr, setSSR] = React.useState<boolean>(true);

  React.useEffect(() => {
    setSSR(false);
  }, []);

  const render = () => {
    return (
      <ConnectedXMClientContext.Provider
        value={{
          ...state,
          queryClient,
        }}
      >
        {children}
      </ConnectedXMClientContext.Provider>
    );
  };

  // prettier-ignore
  if (ssr) return <QueryClientProvider client={queryClient}>{render()}</QueryClientProvider>
  return render();
};
