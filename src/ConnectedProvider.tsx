import { AxiosError } from "axios";
import React from "react";
import { ConnectedXMResponse } from "./interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { MutationParams } from ".";
import useWebSocket from "react-use-websocket";
import useWSProcessor, { WSMessage } from "./websockets/useWebsocketProcessor";

interface SendWSMessage {
  type: string;
  body: object;
}

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
    | "http://0.0.0.0:3005";
  authenticated: boolean;
  getToken: () => Promise<string | undefined>;
  getExecuteAs?: () => Promise<string | undefined> | string | undefined;
  lastWSMessage: WSMessage | null;
  sendWSMessage: (message: SendWSMessage) => void;
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
  extends Omit<
    ConnectedXMClientContextState,
    "sendWSMessage" | "lastWSMessage"
  > {
  children: React.ReactNode;
}

export const ConnectedXMProvider = ({
  children,
  ...state
}: ConnectedXMProviderProps) => {
  const { authenticated, locale, getToken, websocketUrl, organizationId } =
    state;

  const [socketUrl, setSocketUrl] = React.useState<string | null>(null);
  const [messageHistory, setMessageHistory] = React.useState<WSMessage[]>([]);
  const [lastWSMessage, setLastMessage] = React.useState<WSMessage | null>(
    null
  );

  React.useEffect(() => {
    const getSocketUrl = async () => {
      const token = await getToken();
      if (!token) return null;
      setSocketUrl(
        `${websocketUrl}?organization=${organizationId}&authorization=${token}`
      );
    };

    if (authenticated) {
      getSocketUrl();
    }
  }, [authenticated, getToken, websocketUrl, organizationId]);

  const { sendJsonMessage, lastMessage } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: () => true,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
      reconnectAttempts: 5, // Max reconnect attempts
      heartbeat: {
        interval: 25000,
        message: JSON.stringify({ type: "heartbeat" }),
        returnMessage: JSON.stringify({ type: "pulse" }),
        timeout: 60000,
      },
    },
    !!authenticated
  );

  React.useEffect(() => {
    if (!lastMessage) return;
    const newMessage: WSMessage = JSON.parse(lastMessage.data);

    if (messageHistory.length > 0) {
      if (
        messageHistory[messageHistory.length - 1]?.timestamp ===
        newMessage.timestamp
      ) {
        return;
      }
    }

    setMessageHistory((prev) => [...prev, newMessage]);
    setLastMessage(newMessage);
  }, [lastMessage, messageHistory]);

  const sendWSMessage = (message: SendWSMessage) => {
    sendJsonMessage(message);
  };

  useWSProcessor({ lastWSMessage, locale });

  return (
    <ConnectedXMClientContext.Provider
      value={{
        ...state,
        lastWSMessage,
        sendWSMessage,
      }}
    >
      {children}
    </ConnectedXMClientContext.Provider>
  );
};
