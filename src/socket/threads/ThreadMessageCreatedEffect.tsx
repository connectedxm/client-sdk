import { MessageEffect } from "../WSMessageBus";
import { ConnectedXMResponse, Thread, ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import { SET_THREAD_MESSAGE_QUERY_DATA } from "@src/queries/threads/useGetThreadMessage";
import { AppendInfiniteQuery } from "@src/utilities";
import { GetBaseSingleQueryKeys } from "@src/queries/useConnectedSingleQuery";
import { THREAD_QUERY_KEY } from "@src/queries/threads/useGetThread";

const ThreadMessageCreatedEffect: MessageEffect<ThreadMessage> = (
  queryClient,
  locale,
  newMessage
) => {
  console.log("ThreadMessageCreatedEffect", newMessage);

  SET_THREAD_MESSAGE_QUERY_DATA(
    queryClient,
    [newMessage.threadId, newMessage.id],
    {
      status: "ok",
      message: "Cached from WebSocket",
      data: newMessage,
    }
  );

  AppendInfiniteQuery<ThreadMessage>(
    queryClient,
    THREAD_MESSAGES_QUERY_KEY(newMessage.threadId),
    locale,
    newMessage
  );

  // Update the thread query data
  queryClient.setQueryData(
    [
      ...THREAD_QUERY_KEY(newMessage.threadId),
      ...GetBaseSingleQueryKeys(locale),
    ],
    (oldData: ConnectedXMResponse<Thread>) => {
      return {
        ...oldData,
        data: {
          ...oldData.data,
          lastMessageAt: newMessage.sentAt,
          lastMessage: newMessage.body,
        },
      } as ConnectedXMResponse<Thread>;
    }
  );
};

export default ThreadMessageCreatedEffect;
