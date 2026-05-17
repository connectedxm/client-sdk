import React from "react";
import { useWSEvent } from "../WSMessageBus";

/**
 * Per-thread typing state, keyed by threadId → (accountId → typingAt ISO).
 *
 * `ThreadTypingStore` is instantiated once per `ConnectedProvider` and made
 * available via context. `ThreadTypingEffect` mounts somewhere in the tree
 * and feeds the store from the WS message bus; consumers read via
 * `useThreadTyping(threadId)`.
 *
 * The store keeps state in instance fields (not module-scoped) so multiple
 * provider trees — tests, micro-frontends, dual-org embeds — don't bleed
 * typing events into each other.
 */

type TypingMap = Record<string, Record<string, string>>;

type Listener = (state: TypingMap) => void;

const TYPING_TTL_MS = 6000;

// Stable empty reference so consumers can use the return value in dep arrays
// without firing on every unrelated typing event.
const EMPTY_THREAD_TYPING: Record<string, string> = Object.freeze({});

export class ThreadTypingStore {
  private state: TypingMap = {};
  private listeners = new Set<Listener>();
  private expiryTimers = new Map<string, ReturnType<typeof setTimeout>>();

  private setState(next: TypingMap) {
    this.state = next;
    this.listeners.forEach((listener) => listener(this.state));
  }

  private scheduleExpiry(threadId: string, accountId: string) {
    const key = `${threadId}::${accountId}`;
    const existing = this.expiryTimers.get(key);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      this.expiryTimers.delete(key);
      const threadMap = this.state[threadId];
      if (!threadMap || !(accountId in threadMap)) return;
      const nextThreadMap = { ...threadMap };
      delete nextThreadMap[accountId];
      const next = { ...this.state };
      if (Object.keys(nextThreadMap).length === 0) {
        delete next[threadId];
      } else {
        next[threadId] = nextThreadMap;
      }
      this.setState(next);
    }, TYPING_TTL_MS);
    this.expiryTimers.set(key, timer);
  }

  record(threadId: string, accountId: string, typingAt: string) {
    const nextThreadMap = {
      ...(this.state[threadId] ?? {}),
      [accountId]: typingAt,
    };
    this.setState({ ...this.state, [threadId]: nextThreadMap });
    this.scheduleExpiry(threadId, accountId);
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): TypingMap => this.state;
}

const ThreadTypingStoreContext = React.createContext<ThreadTypingStore | null>(
  null
);

export interface ThreadTypingStoreProviderProps {
  store?: ThreadTypingStore;
  children: React.ReactNode;
}

export const ThreadTypingStoreProvider = ({
  store,
  children,
}: ThreadTypingStoreProviderProps) => {
  const ref = React.useRef<ThreadTypingStore | null>(null);
  if (!ref.current) {
    ref.current = store ?? new ThreadTypingStore();
  }
  return (
    <ThreadTypingStoreContext.Provider value={ref.current}>
      {children}
    </ThreadTypingStoreContext.Provider>
  );
};

const useThreadTypingStore = (): ThreadTypingStore => {
  const store = React.useContext(ThreadTypingStoreContext);
  if (!store) {
    throw new Error(
      "useThreadTypingStore must be used within a ConnectedProvider"
    );
  }
  return store;
};

/**
 * Read the typing-state map for a given thread. Returns `{ [accountId]: ISO }`.
 * Returns a stable frozen object reference when the thread has no entries.
 * Entries auto-expire after ~6s of inactivity.
 */
export const useThreadTyping = (
  threadId: string
): Record<string, string> => {
  const store = useThreadTypingStore();
  const fullState = React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
  return fullState[threadId] ?? EMPTY_THREAD_TYPING;
};

/**
 * Mount once at the provider level to wire `thread.typing` → the typing store.
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

export default ThreadTypingEffect;
