import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnected } from "@src/hooks";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import { THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreads";
import { prepend } from "@src/utilities/InfiniteQueryHelpers";
import { useWSEvent } from "../WSMessageBus";
import type { ThreadMessage, Thread, ConnectedXMResponse } from "@src/interfaces";
import { produce } from "immer";
import type { InfiniteData } from "@tanstack/react-query";

/**
 * Subscribes to `thread.message.created` and:
 *  - prepends the incoming message to the messages cache for the thread
 *  - bumps the parent thread's `lastMessageAt` / `lastMessage` so list order
 *    reflects the new activity
 */
export const ThreadMessageCreatedEffect = (): null => {
  const queryClient = useQueryClient();
  const { locale } = useConnected();

  const handler = React.useCallback(
    (payload: { threadId: string; message: ThreadMessage }) => {
      const messagesKey = [
        ...THREAD_MESSAGES_QUERY_KEY(payload.threadId),
        ...GetBaseInfiniteQueryKeys(locale || "en"),
      ];

      prepend<ThreadMessage>(queryClient, messagesKey, payload.message);

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
            let found: Thread | null = null;
            let foundPageIdx = -1;
            let foundIdx = -1;
            for (let p = 0; p < draft.pages.length; p++) {
              const page = draft.pages[p];
              if (!page?.data) continue;
              const idx = page.data.findIndex(
                (t) => t.id === payload.threadId
              );
              if (idx !== -1) {
                found = page.data[idx] as Thread;
                foundPageIdx = p;
                foundIdx = idx;
                break;
              }
            }

            if (found && foundPageIdx !== -1) {
              const sourcePage = draft.pages[foundPageIdx];
              if (sourcePage?.data) {
                sourcePage.data.splice(foundIdx, 1);
              }
              found.lastMessageAt = payload.message.sentAt;
              found.lastMessage = payload.message.body;
              const firstPage = draft.pages[0];
              if (firstPage?.data) {
                firstPage.data.unshift(found);
              }
            }
          });
        }
      );
    },
    [queryClient, locale]
  );

  useWSEvent("thread.message.created", handler);

  return null;
};

export default ThreadMessageCreatedEffect;
