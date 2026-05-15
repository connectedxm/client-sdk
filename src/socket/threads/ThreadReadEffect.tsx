import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnected } from "@src/hooks";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";
import { THREAD_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadAccounts";
import { useWSEvent } from "../WSMessageBus";
import { produce } from "immer";
import type { InfiniteData } from "@tanstack/react-query";
import type { ConnectedXMResponse, ThreadAccount } from "@src/interfaces";

/**
 * Subscribes to `thread.read` and updates the thread participants cache so
 * read-receipts surface in UI. We treat `ThreadAccount` rows as the canonical
 * "viewer" projection for the thread participants list.
 */
export const ThreadReadEffect = (): null => {
  const queryClient = useQueryClient();
  const { locale } = useConnected();

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
                (page.data[idx] as any).lastReadAt = payload.readAt;
                return;
              }
            }
          });
        }
      );
    },
    [queryClient, locale]
  );

  useWSEvent("thread.read", handler);

  return null;
};

export default ThreadReadEffect;
