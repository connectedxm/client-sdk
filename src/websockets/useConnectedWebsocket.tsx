import React from "react";
import { ConnectedXMClientContextState } from "../ConnectedProvider";
import { ReceivedWSMessage, SendWSMessage } from "./interfaces";
import ChatNewMessage from "./chat/ChatNewMessage";
import ThreadMessageCreated from "./threads/messages/ThreadMessageCreated";
import ThreadMessageDeleted from "./threads/messages/ThreadMessageDeleted";
import ThreadMessageUpdated from "./threads/messages/ThreadMessageUpdated";
import { useQueryClient } from "@tanstack/react-query";
import type UseWebSocket from "react-use-websocket";

interface ConnectedWebsocketProps
  extends Omit<
    ConnectedXMClientContextState,
    "sendWSMessage" | "lastWSMessage"
  > {}

export const useConnectedWebsocket = (
  useWebSocket: typeof UseWebSocket,
  {
    authenticated,
    locale,
    getToken,
    websocketUrl,
    organizationId,
  }: ConnectedWebsocketProps
) => {
  const queryClient = useQueryClient();

  const [socketUrl, setSocketUrl] = React.useState<string | null>(null);
  const [messageHistory, setMessageHistory] = React.useState<
    ReceivedWSMessage[]
  >([]);
  const [lastWSMessage, setLastMessage] =
    React.useState<ReceivedWSMessage | null>(null);

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
    } else {
      setSocketUrl(null);
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
    const newMessage: ReceivedWSMessage = JSON.parse(lastMessage.data);

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

  React.useEffect(() => {
    if (!lastWSMessage) return;

    if (lastWSMessage.type === "new-message") {
      ChatNewMessage(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "thread.message.created") {
      ThreadMessageCreated(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "thread.message.updated") {
      ThreadMessageUpdated(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "thread.message.deleted") {
      ThreadMessageDeleted(queryClient, locale, lastWSMessage);
    }
  });

  return { sendWSMessage, lastWSMessage };
};
