import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnected } from "@src/hooks";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import { THREAD_MESSAGE_REPLIES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessageReplies";
import { THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreads";
import { prepend } from "@src/utilities/InfiniteQueryHelpers";
import { MergeInfinitePages } from "@src/utilities";
import { useWSEvent } from "../WSMessageBus";
import type { ThreadMessage, Thread, ConnectedXMResponse } from "@src/interfaces";
import { produce } from "immer";
import type { InfiniteData } from "@tanstack/react-query";

/**
 * Subscribes to `thread.message.created`. Routing depends on whether the
 * incoming message is a sub-thread reply:
 *
 *  - Top-level message (`replyToId == null`): prepend to the thread messages
 *    cache and bump the parent thread's `lastMessageAt` / `lastMessage` so
 *    the thread list reflects the new activity.
 *  - Sub-thread reply (`replyToId != null`): bump the parent message's
 *    `_count.replies` in the messages cache and invalidate the per-parent
 *    replies cache so the open sub-thread refetches. The threads list is
 *    intentionally not bumped — `lastMessage` is the thread's top-level
 *    message, not a nested reply body.
 *
 * Auto-mounted by `ConnectedProvider`; not exposed to consumers.
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

      const { replyToId } = payload.message;

      if (replyToId) {
        queryClient.setQueryData(
          messagesKey,
          (
            oldData:
              | InfiniteData<ConnectedXMResponse<ThreadMessage[]>>
              | undefined
          ) => {
            if (!oldData) return oldData;
            return produce(oldData, (draft) => {
              for (const page of draft.pages) {
                if (!page?.data) continue;
                const parent = page.data.find((msg) => msg.id === replyToId);
                if (parent) {
                  parent._count.replies += 1;
                  return;
                }
              }
            });
          }
        );

        queryClient.invalidateQueries({
          queryKey: [
            ...THREAD_MESSAGE_REPLIES_QUERY_KEY(payload.threadId, replyToId),
            ...GetBaseInfiniteQueryKeys(locale || "en"),
          ],
        });

        return;
      }

      // Dedup: skip if the message is already in the cache (e.g. the sender
      // optimistically inserted it, or we briefly disconnected and refetched).
      const existing =
        queryClient.getQueryData<
          InfiniteData<ConnectedXMResponse<ThreadMessage[]>>
        >(messagesKey);
      const alreadyCached = existing
        ? MergeInfinitePages(existing).some(
            (msg: ThreadMessage) => msg.id === payload.message.id
          )
        : false;

      if (!alreadyCached) {
        prepend<ThreadMessage>(queryClient, messagesKey, payload.message);
      }

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
