import type { ChatChannelMessage, ConnectedXMResponse } from "@src/interfaces";
import type { InfiniteData } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import {
  GetBaseInfiniteQueryKeys,
  CHAT_CHANNEL_MESSAGES_QUERY_KEY,
} from "@src/queries";
import { AppendInfiniteQuery, MergeInfinitePages } from "@src/utilities";

export interface WSNewChatMessage {
  timestamp: number;
  type: "new-message";
  body: {
    channelId: number;
    message: ChatChannelMessage;
  };
}

const ChatNewMessage = (
  queryClient: QueryClient,
  locale: string,
  message: WSNewChatMessage
) => {
  const QueryKey = [
    ...CHAT_CHANNEL_MESSAGES_QUERY_KEY(message.body.channelId.toString()),
    ...GetBaseInfiniteQueryKeys(locale || "en"),
  ];

  const existingMessages =
    queryClient.getQueryData<
      InfiniteData<ConnectedXMResponse<ChatChannelMessage[]>>
    >(QueryKey);

  const exists = existingMessages
    ? MergeInfinitePages(existingMessages).find(
        (message) => message.id === message.id
      )
    : false;

  if (!exists) {
    AppendInfiniteQuery(queryClient, QueryKey, message.body.message);
  }
};

export default ChatNewMessage;
