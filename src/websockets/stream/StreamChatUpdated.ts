import type { StreamChatMessage, ConnectedXMResponse } from "@src/interfaces";
import type { InfiniteData } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { produce } from "immer";

import { GetBaseInfiniteQueryKeys } from "@src/queries";
import { STREAM_CHAT_MESSAGES_QUERY_KEY } from "@src/queries/streams/useGetStreamChatMessages";

export interface WSStreamChatUpdated {
  timestamp: number;
  type: "stream.chat.updated";
  body: {
    streamId: string;
    sessionId: string;
    message: StreamChatMessage;
  };
}

const StreamChatUpdated = (
  queryClient: QueryClient,
  locale: string,
  message: WSStreamChatUpdated
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
              const index = page.data.findIndex(
                (msg) => msg.messageId === message.body.message.messageId
              );
              if (index !== -1) {
                page.data[index] = message.body.message;
                break;
              }
            }
          }
        }
      });
    }
  );
};

export default StreamChatUpdated;
