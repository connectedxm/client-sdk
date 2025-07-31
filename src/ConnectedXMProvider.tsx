import { AxiosError } from "axios";
import React from "react";
import { ConnectedXMResponse } from "./interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { MutationParams } from ".";

export interface ConnectedXMClientContextState {
  queryClient: QueryClient;
  organizationId: string;
  apiUrl:
    | "https://client-api.connected.dev"
    | "https://staging-client-api.connected.dev"
    | "http://localhost:4001";
  authenticated: boolean;
  getToken: () => Promise<string | undefined>;
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
  onMutationError?: (
    error: AxiosError<ConnectedXMResponse<null>>,
    variables: Omit<MutationParams, "queryClient" | "clientApiParams">,
    context: unknown
  ) => void;
}

export const ConnectedXMClientContext =
  React.createContext<ConnectedXMClientContextState>(
    {} as ConnectedXMClientContextState
  );

export interface ConnectedXMProviderProps
  extends ConnectedXMClientContextState {
  children: React.ReactNode;
}

export const ConnectedXMProvider = ({
  children,
  ...state
}: ConnectedXMProviderProps) => {
  return (
    <ConnectedXMClientContext.Provider value={state}>
      {children}
    </ConnectedXMClientContext.Provider>
  );
};
