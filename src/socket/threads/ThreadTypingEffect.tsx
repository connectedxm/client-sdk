import React from "react";
import { useWSEvent } from "../WSMessageBus";
import { useThreadTypingStore } from "./ThreadTypingStore";

/**
 * Subscribes to `thread.typing` and feeds the per-provider `ThreadTypingStore`.
 *
 * Auto-mounted by `ConnectedProvider`; not exposed to consumers.
 */
export const ThreadTypingEffect = (): null => {
  const store = useThreadTypingStore();
  const handler = React.useCallback(
    (payload: { threadId: string; accountId: string; typingAt: string }) => {
      store.record(payload.threadId, payload.accountId, payload.typingAt);
    },
    [store]
  );

  useWSEvent("thread.typing", handler);

  return null;
};
