import type { ChatChannelMessage, ConnectedXMResponse } from "@src/interfaces";
import type { InfiniteData } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { produce } from "immer";

import {
  GetBaseInfiniteQueryKeys,
  SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY,
} from "@src/queries";

export interface WSChatMessageUpdated {
  type: "chat.message.updated";
  timestamp: number;
  body: {
    channelId: number;
    message: ChatChannelMessage;
  };
}

const ChatMessageUpdated = (
  queryClient: QueryClient,
  locale: string,
  message: WSChatMessageUpdated
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
              const index = page.data.findIndex(
                (msg) => msg.id === message.body.message.id
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

export default ChatMessageUpdated;
