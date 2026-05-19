import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnected } from "@src/hooks";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import { update as updateInfinite } from "@src/utilities/InfiniteQueryHelpers";
import { useWSEvent } from "../WSMessageBus";
import type { ThreadMessage } from "@src/interfaces";

/**
 * Subscribes to `thread.message.updated` and patches the matching message in
 * the messages cache for the thread.
 *
 * Auto-mounted by `ConnectedProvider`; not exposed to consumers.
 */
export const ThreadMessageUpdatedEffect = (): null => {
  const queryClient = useQueryClient();
  const { locale } = useConnected();

  const handler = React.useCallback(
    (payload: { threadId: string; message: ThreadMessage }) => {
      const messagesKey = [
        ...THREAD_MESSAGES_QUERY_KEY(payload.threadId),
        ...GetBaseInfiniteQueryKeys(locale || "en"),
      ];
      updateInfinite<ThreadMessage>(queryClient, messagesKey, payload.message);
    },
    [queryClient, locale]
  );

  useWSEvent("thread.message.updated", handler);

  return null;
};
