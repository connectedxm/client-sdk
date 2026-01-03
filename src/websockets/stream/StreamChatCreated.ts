import type { StreamChatMessage, ConnectedXMResponse } from "@src/interfaces";
import type { InfiniteData } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { GetBaseInfiniteQueryKeys } from "@src/queries";
import { STREAM_CHAT_MESSAGES_QUERY_KEY } from "@src/queries/streams/useGetStreamChatMessages";
import { AppendInfiniteQuery, MergeInfinitePages } from "@src/utilities";

export interface WSStreamChatCreated {
  timestamp: number;
  type: "stream.chat.created";
  body: {
    streamId: string;
    sessionId: string;
    message: StreamChatMessage;
  };
}

const StreamChatCreated = (
  queryClient: QueryClient,
  locale: string,
  message: WSStreamChatCreated
) => {
  const QueryKey = [
    ...STREAM_CHAT_MESSAGES_QUERY_KEY(
      message.body.streamId,
      message.body.sessionId
    ),
    ...GetBaseInfiniteQueryKeys(locale || "en"),
  ];

  const existingMessages =
    queryClient.getQueryData<
      InfiniteData<ConnectedXMResponse<StreamChatMessage[]>>
    >(QueryKey);

  const exists = existingMessages
    ? MergeInfinitePages(existingMessages).find(
        (msg) => msg.messageId === message.body.message.messageId
      )
    : false;

  if (!exists) {
    AppendInfiniteQuery(queryClient, QueryKey, message.body.message);
  }
};

export default StreamChatCreated;
