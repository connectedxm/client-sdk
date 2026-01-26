import type { ChatChannelMessage, ConnectedXMResponse } from "@src/interfaces";
import type { InfiniteData } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import {
  GetBaseInfiniteQueryKeys,
  SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY,
} from "@src/queries";
import { AppendInfiniteQuery, MergeInfinitePages } from "@src/utilities";

export interface WSChatMessageCreated {
  type: "chat.message.created";
  timestamp: number;
  body: {
    channelId: number;
    message: ChatChannelMessage;
  };
}

const ChatMessageCreated = (
  queryClient: QueryClient,
  locale: string,
  message: WSChatMessageCreated
) => {
  const QueryKey = [
    ...SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(message.body.channelId.toString()),
    ...GetBaseInfiniteQueryKeys(locale || "en"),
  ];

  const existingMessages =
    queryClient.getQueryData<
      InfiniteData<ConnectedXMResponse<ChatChannelMessage[]>>
    >(QueryKey);

  const exists = existingMessages
    ? MergeInfinitePages(existingMessages).find(
        (msg) => msg.id === message.body.message.id
      )
    : false;

  if (!exists) {
    AppendInfiniteQuery(queryClient, QueryKey, message.body.message);
  }
};

export default ChatMessageCreated;
