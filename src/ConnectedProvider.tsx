import { AxiosError } from "axios";
import React from "react";
import { ConnectedXMResponse } from "./interfaces";
import { MutationParams } from "./mutations";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type UseWebSocket from "react-use-websocket";
import {
  ReceivedWSMessage,
  SendWSMessage,
  useConnectedWebsocket,
} from "./websockets";

export interface ConnectedXMClientContextState {
  queryClient: QueryClient;
  organizationId: string;
  apiUrl:
    | "https://client-api.connected.dev"
    | "https://staging-client-api.connected.dev"
    | "http://localhost:4001";
  websocketUrl:
    | "wss://websocket.connected.dev"
    | "wss://staging-websocket.connected.dev"
    | "ws://0.0.0.0:3005";
  authenticated: boolean;
  getToken: () => Promise<string | undefined>;
  getExecuteAs?: () => Promise<string | undefined> | string | undefined;
  locale: string;
  sendWSMessage: (message: SendWSMessage) => void;
  lastWSMessage: ReceivedWSMessage | null;
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

export interface ConnectedProviderProps
  extends Omit<
    ConnectedXMClientContextState,
    "sendWSMessage" | "lastWSMessage"
  > {
  useWebSocket: typeof UseWebSocket;
  children: React.ReactNode;
}

export const ConnectedProvider = ({
  children,
  useWebSocket,
  ...state
}: ConnectedProviderProps) => {
  const { sendWSMessage, lastWSMessage } = useConnectedWebsocket(
    useWebSocket,
    state
  );
  return (
    <ConnectedXMClientContext.Provider
      value={{ ...state, sendWSMessage, lastWSMessage }}
    >
      {children}
    </ConnectedXMClientContext.Provider>
  );
};
