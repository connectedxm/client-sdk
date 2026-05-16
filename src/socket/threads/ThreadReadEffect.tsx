import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnected } from "@src/hooks";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";
import { THREAD_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadAccounts";
import { THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreads";
import { useGetSelf } from "@src/queries/self/useGetSelf";
import { useWSEvent } from "../WSMessageBus";
import { produce } from "immer";
import type { InfiniteData } from "@tanstack/react-query";
import type {
  ConnectedXMResponse,
  Thread,
  ThreadAccount,
} from "@src/interfaces";

/**
 * Subscribes to `thread.read` and updates the thread participants cache so
 * read-receipts surface in UI. When the reader is self, we also clear the
 * unread badge on that thread (`_count.messages = 0`) in the threads list.
 */
export const ThreadReadEffect = (): null => {
  const queryClient = useQueryClient();
  const { locale } = useConnected();
  const { data: self } = useGetSelf();
  const selfId = self?.data?.id;

  const handler = React.useCallback(
    (payload: {
      threadId: string;
      accountId: string;
      messageId?: string;
      readAt: string;
    }) => {
      const accountsKey = [
        ...THREAD_ACCOUNTS_QUERY_KEY(payload.threadId),
        ...GetBaseInfiniteQueryKeys(locale || "en"),
      ];

      queryClient.setQueryData(
        accountsKey,
        (
          oldData:
            | InfiniteData<ConnectedXMResponse<ThreadAccount[]>>
            | undefined
        ) => {
          if (!oldData) return oldData;
          return produce(oldData, (draft) => {
            for (const page of draft.pages) {
              if (!page?.data) continue;
              const idx = page.data.findIndex(
                (entry) => entry.accountId === payload.accountId
              );
              if (idx !== -1) {
                // immer's Draft<T> narrows the field out — write through `as any`.
                (page.data[idx] as any).lastReadAt = payload.readAt;
                return;
              }
            }
          });
        }
      );

      // If self read, clear the unread badge on the threads list for this row.
      if (!selfId || payload.accountId !== selfId) return;

      const threadsKey = [
        ...THREADS_QUERY_KEY(),
        ...GetBaseInfiniteQueryKeys(locale || "en"),
      ];
      queryClient.setQueryData(
        threadsKey,
        (
          oldData: InfiniteData<ConnectedXMResponse<Thread[]>> | undefined
        ) => {
          if (!oldData) return oldData;
          return produce(oldData, (draft) => {
            for (const page of draft.pages) {
              if (!page?.data) continue;
              const idx = page.data.findIndex(
                (t) => t.id === payload.threadId
              );
              if (idx !== -1 && page.data[idx]._count) {
                page.data[idx]._count!.messages = 0;
                return;
              }
            }
          });
        }
      );
    },
    [queryClient, locale, selfId]
  );

  useWSEvent("thread.read", handler);

  return null;
};

export default ThreadReadEffect;
