import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnected } from "@src/hooks";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import { remove as removeInfinite } from "@src/utilities/InfiniteQueryHelpers";
import { useWSEvent } from "../WSMessageBus";
import type { ThreadMessage } from "@src/interfaces";

/**
 * Subscribes to `thread.message.deleted` and removes the matching message
 * from the thread's messages cache.
 */
export const ThreadMessageDeletedEffect = (): null => {
  const queryClient = useQueryClient();
  const { locale } = useConnected();

  const handler = React.useCallback(
    (payload: { threadId: string; messageId: string }) => {
      const messagesKey = [
        ...THREAD_MESSAGES_QUERY_KEY(payload.threadId),
        ...GetBaseInfiniteQueryKeys(locale || "en"),
      ];
      removeInfinite<ThreadMessage>(queryClient, messagesKey, payload.messageId);
    },
    [queryClient, locale]
  );

  useWSEvent("thread.message.deleted", handler);

  return null;
};

export default ThreadMessageDeletedEffect;
