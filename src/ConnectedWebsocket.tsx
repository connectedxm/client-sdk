import React from "react";
import { QueryClient } from "@tanstack/react-query";
import WSMessageBus, { type IncomingWSMessage } from "./socket/WSMessageBus";

// Define ReadyState enum to match the WebSocket.readyState values
export enum ReadyState {
  UNINSTANTIATED = -1,
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface WSContext {
  state: ReadyState;
  sendMessage: (message: OutgoingWSMessage) => void;
  lastMessage: IncomingWSMessage | null;
  isConnected: boolean;
}

export interface OutgoingWSMessage {
  type: string;
  data: Record<string, unknown>;
}

export const ConnectedWebsocketContext = React.createContext<WSContext>(
  {} as WSContext
);

interface ConnectedWebsocketProps {
  children: React.ReactNode;
  queryClient: QueryClient;
  organizationId: string;
  locale: string;
  socketUrl: string;
  token?: string;
}

export const ConnectedWebsocket = ({
  children,
  queryClient,
  organizationId,
  locale,
  socketUrl,
  token,
}: ConnectedWebsocketProps) => {
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [readyState, setReadyState] = React.useState<ReadyState>(
    ReadyState.UNINSTANTIATED
  );

  const [lastMessage, setLastMessage] =
    React.useState<IncomingWSMessage | null>(null);

  // Simple function to send a message
  const sendMessage = React.useCallback(
    (message: OutgoingWSMessage) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket not connected, message not sent");
      }
    },
    [socket]
  );

  // Connect to WebSocket
  const connectWebSocket = React.useCallback((token: string) => {
    try {
      // Create the WebSocket URL with parameters
      const socketUrlWithToken = `${socketUrl}?organization=${organizationId}&authorization=${token}`;
      console.log("Connecting to WebSocket:", socketUrl);

      // Create the WebSocket
      const ws = new WebSocket(socketUrlWithToken);
      setReadyState(ReadyState.CONNECTING);

      // Set up event handlers
      ws.onopen = () => {
        console.log("WebSocket connected");
        setReadyState(ReadyState.OPEN);
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data) as IncomingWSMessage;
          setLastMessage(parsedData);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setReadyState(ReadyState.CLOSED);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setSocket(ws);
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setReadyState(ReadyState.CLOSED);
    }
  }, []);

  // Connect when component mounts or token changes
  React.useEffect(() => {
    if (token) connectWebSocket(token);
    return () => socket?.close();
  }, [token]);

  // Determine if connected
  const isConnected = readyState === ReadyState.OPEN;

  return (
    <ConnectedWebsocketContext.Provider
      value={{
        lastMessage,
        isConnected,
        state: readyState,
        sendMessage,
      }}
    >
      <WSMessageBus
        queryClient={queryClient}
        locale={locale}
        lastMessage={lastMessage}
      />
      {children}
    </ConnectedWebsocketContext.Provider>
  );
};

export const useConnectedWebsocket = () => {
  return React.useContext(ConnectedWebsocketContext);
};

export default ConnectedWebsocket;
