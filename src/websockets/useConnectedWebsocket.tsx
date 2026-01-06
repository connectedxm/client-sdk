import React from "react";
import { ConnectedXMClientContextState } from "../ConnectedProvider";
import { ReceivedWSMessage, SendWSMessage } from "./interfaces";
import ChatNewMessage from "./chat/ChatNewMessage";
import ThreadMessageCreated from "./threads/messages/ThreadMessageCreated";
import ThreadMessageDeleted from "./threads/messages/ThreadMessageDeleted";
import ThreadMessageUpdated from "./threads/messages/ThreadMessageUpdated";
import StreamChatCreated from "./stream/StreamChatCreated";
import StreamChatDeleted from "./stream/StreamChatDeleted";
import StreamChatUpdated from "./stream/StreamChatUpdated";
import StreamConnected from "./stream/StreamConnected";
import StreamDisconnected from "./stream/StreamDisconnected";
import PulseMessage from "./PulseMessage";
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
    getExecuteAs,
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
      const executeAs = getExecuteAs ? await getExecuteAs() : undefined;
      if (!executeAs) return null;

      setSocketUrl(
        `${websocketUrl}?organization=${encodeURIComponent(
          organizationId
        )}&authorization=${encodeURIComponent(
          token
        )}&executeas=${encodeURIComponent(executeAs)}`
      );
    };

    if (authenticated) {
      getSocketUrl();
    } else {
      setSocketUrl(null);
    }
  }, [authenticated, getToken, getExecuteAs, websocketUrl, organizationId]);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: () => true,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
      reconnectAttempts: 5, // Max reconnect attempts
      heartbeat: {
        interval: 15000,
        message: JSON.stringify({ type: "heartbeat" }),
        returnMessage: JSON.stringify({ type: "pulse" }),
        timeout: 20000,
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
    } else if (lastWSMessage.type === "stream.chat.created") {
      StreamChatCreated(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "stream.chat.deleted") {
      StreamChatDeleted(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "stream.chat.updated") {
      StreamChatUpdated(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "stream.connected") {
      StreamConnected(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "stream.disconnected") {
      StreamDisconnected(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "pulse") {
      PulseMessage(queryClient, locale, lastWSMessage);
    }
  });

  return { sendWSMessage, lastWSMessage, readyState };
};
