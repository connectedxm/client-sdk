import type { ChatChannelMessage, ConnectedXMResponse } from "@src/interfaces";
import type { InfiniteData } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { produce } from "immer";

import {
  GetBaseInfiniteQueryKeys,
  SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY,
} from "@src/queries";

export interface WSChatMessageDeleted {
  type: "chat.message.deleted";
  timestamp: number;
  body: {
    channelId: number;
    messageId: number;
  };
}

const ChatMessageDeleted = (
  queryClient: QueryClient,
  locale: string,
  message: WSChatMessageDeleted
) => {
  const QueryKey = [
    ...SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(message.body.channelId.toString()),
    ...GetBaseInfiniteQueryKeys(locale || "en"),
  ];

  queryClient.setQueryData(
    QueryKey,
    (oldData: InfiniteData<ConnectedXMResponse<ChatChannelMessage[]>>) => {
      return produce(oldData, (draft) => {
        if (draft?.pages) {
          for (const page of draft.pages) {
            if (page?.data) {
              page.data = page.data.filter(
                (msg) => msg.id !== message.body.messageId
              );
            }
          }
        }
      });
    }
  );
};

export default ChatMessageDeleted;
