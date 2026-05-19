import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnected } from "@src/hooks";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";
import { GetBaseSingleQueryKeys } from "@src/queries/useConnectedSingleQuery";
import { THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreads";
import { THREAD_QUERY_KEY } from "@src/queries/threads/useGetThread";
import { MergeInfinitePages } from "@src/utilities";
import { useWSEvent } from "../WSMessageBus";
import type { Thread, ConnectedXMResponse } from "@src/interfaces";
import { produce } from "immer";
import type { InfiniteData } from "@tanstack/react-query";

/**
 * Subscribes to `thread.created` and:
 *  - prepends the new thread to the threads list cache
 *  - seeds the single-thread query cache so a navigation into the new thread
 *    has data immediately
 */
export const ThreadCreatedEffect = (): null => {
  const queryClient = useQueryClient();
  const { locale } = useConnected();

  const handler = React.useCallback(
    (payload: { threadId: string; thread: Thread }) => {
      const threadsKey = [
        ...THREADS_QUERY_KEY(),
        ...GetBaseInfiniteQueryKeys(locale || "en"),
      ];

      queryClient.setQueryData(
        threadsKey,
        (oldData: InfiniteData<ConnectedXMResponse<Thread[]>> | undefined) => {
          if (!oldData) return oldData;

          const alreadyCached = MergeInfinitePages(oldData).some(
            (t: Thread) => t.id === payload.threadId
          );
          if (alreadyCached) return oldData;

          return produce(oldData, (draft) => {
            const firstPage = draft.pages[0];
            if (firstPage?.data) {
              firstPage.data.unshift(payload.thread);
            }
          });
        }
      );

      const threadKey = [
        ...THREAD_QUERY_KEY(payload.threadId),
        ...GetBaseSingleQueryKeys(locale || "en"),
      ];
      queryClient.setQueryData(threadKey, {
        data: payload.thread,
      } as ConnectedXMResponse<Thread>);
    },
    [queryClient, locale]
  );

  useWSEvent("thread.created", handler);

  return null;
};

export default ThreadCreatedEffect;
