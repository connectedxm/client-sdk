import type { StreamChatMessage, ConnectedXMResponse } from "@src/interfaces";
import type { InfiniteData } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { produce } from "immer";

import { GetBaseInfiniteQueryKeys } from "@src/queries";
import { STREAM_CHAT_MESSAGES_QUERY_KEY } from "@src/queries/streams/useGetStreamChatMessages";

export interface WSStreamChatDeleted {
  timestamp: number;
  type: "stream.chat.deleted";
  body: {
    streamId: string;
    sessionId: string;
    messageId: string;
  };
}

const StreamChatDeleted = (
  queryClient: QueryClient,
  locale: string,
  message: WSStreamChatDeleted
) => {
  const QueryKey = [
    ...STREAM_CHAT_MESSAGES_QUERY_KEY(
      message.body.streamId,
      message.body.sessionId
    ),
    ...GetBaseInfiniteQueryKeys(locale || "en"),
  ];

  queryClient.setQueryData(
    QueryKey,
    (oldData: InfiniteData<ConnectedXMResponse<StreamChatMessage[]>>) => {
      return produce(oldData, (draft) => {
        if (draft?.pages) {
          for (const page of draft.pages) {
            if (page?.data) {
              page.data = page.data.filter(
                (msg) => msg.messageId !== message.body.messageId
              );
            }
          }
        }
      });
    }
  );
};

export default StreamChatDeleted;
