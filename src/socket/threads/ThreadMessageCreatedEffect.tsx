import { MessageEffect } from "../WSMessageBus";
import { Thread, ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import {
  PrependInfiniteQuery,
  SetSingleQueryData,
  UpdateInfiniteQueryItem,
} from "@src/utilities";
import {
  DIRECT_THREADS_QUERY_KEY,
  PRIVATE_THREADS_QUERY_KEY,
  PUBLIC_THREADS_QUERY_KEY,
  THREAD_MESSAGE_QUERY_KEY,
} from "@src/queries";

const ThreadMessageCreatedEffect: MessageEffect<ThreadMessage> = (
  queryClient,
  locale,
  newMessage
) => {
  SetSingleQueryData<ThreadMessage>(
    queryClient,
    THREAD_MESSAGE_QUERY_KEY(newMessage.threadId, newMessage.id),
    locale,
    newMessage
  );

  PrependInfiniteQuery<ThreadMessage>(
    queryClient,
    THREAD_MESSAGES_QUERY_KEY(newMessage.threadId),
    locale,
    newMessage
  );

  // Update the thread query data
  UpdateInfiniteQueryItem<Thread>(
    queryClient,
    PRIVATE_THREADS_QUERY_KEY(),
    locale,
    (thread) => ({ ...thread, lastMessageAt: newMessage.sentAt }),
    (thread) => thread.id === newMessage.threadId
  );

  UpdateInfiniteQueryItem<Thread>(
    queryClient,
    PUBLIC_THREADS_QUERY_KEY(),
    locale,
    (thread) => ({ ...thread, lastMessageAt: newMessage.sentAt }),
    (thread) => thread.id === newMessage.threadId
  );

  UpdateInfiniteQueryItem<Thread>(
    queryClient,
    DIRECT_THREADS_QUERY_KEY(),
    locale,
    (thread) => ({ ...thread, lastMessageAt: newMessage.sentAt }),
    (thread) => thread.id === newMessage.threadId
  );

  // UpdateInfiniteQueryItem<Thread>(
  //   queryClient,
  //   GROUP_THREADS_QUERY_KEY(),
  //   locale,
  //   (thread) => ({ ...thread, lastMessageAt: newMessage.sentAt }),
  //   (thread) => thread.id === newMessage.threadId
  // );
};

export default ThreadMessageCreatedEffect;
