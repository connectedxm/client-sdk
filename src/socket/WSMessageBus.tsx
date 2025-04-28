import { QueryClient } from "@tanstack/react-query";
import React from "react";

import ThreadMessageCreatedEffect from "./threads/ThreadMessageCreatedEffect";
import ThreadMessageUpdatedEffect from "./threads/ThreadMessageUpdatedEffect";
import ThreadMessageDeletedEffect from "./threads/ThreadMessageDeletedEffect";

export type MessageType = keyof typeof MessageTypes;

export interface IncomingWSMessage {
  id: string;
  type: MessageType;
  data: unknown;
}

export type MessageEffect<TData> = (
  queryClient: QueryClient,
  locale: string,
  data: TData
) => void;

const MessageTypes: Record<string, MessageEffect<any>> = {
  "thread.message.created": ThreadMessageCreatedEffect,
  "thread.message.updated": ThreadMessageUpdatedEffect,
  "thread.message.deleted": ThreadMessageDeletedEffect,
};

interface WSMessageBusProps {
  queryClient: QueryClient;
  locale: string;
  lastMessage: IncomingWSMessage | null;
}

const WSMessageBus = ({
  queryClient,
  locale,
  lastMessage,
}: WSMessageBusProps) => {
  const [messages, setMessages] = React.useState<Record<string, any>>([]);

  const handleMessage = async (message: IncomingWSMessage) => {
    setMessages((prev) => ({ ...prev, [message.id]: message }));
    const effect = MessageTypes[message.type];
    if (effect) {
      effect(queryClient, locale, message.data);
    } else {
      console.warn(`Unknown WS message type: ${message.type}`);
    }
  };

  React.useEffect(() => {
    if (lastMessage && !messages[lastMessage.id]) {
      handleMessage(lastMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  return null;
};

export default WSMessageBus;
