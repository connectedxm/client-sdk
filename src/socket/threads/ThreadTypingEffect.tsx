import React from "react";
import { useWSEvent } from "../WSMessageBus";

/**
 * Per-thread typing state, keyed by threadId → (accountId → typingAt ISO).
 *
 * `ThreadTypingEffect` mounts somewhere in the tree and feeds this store from
 * the WS message bus. Consumers read via `useThreadTyping(threadId)`.
 *
 * The store is intentionally module-scoped (not React Query) because typing
 * is ephemeral and high-frequency — cache invalidation would thrash.
 */

type TypingMap = Record<string, Record<string, string>>;

type Listener = (state: TypingMap) => void;

const TYPING_TTL_MS = 6000;

let state: TypingMap = {};
const listeners = new Set<Listener>();
const expiryTimers = new Map<string, ReturnType<typeof setTimeout>>();

const setState = (next: TypingMap) => {
  state = next;
  listeners.forEach((listener) => listener(state));
};

const scheduleExpiry = (threadId: string, accountId: string) => {
  const key = `${threadId}::${accountId}`;
  const existing = expiryTimers.get(key);
  if (existing) clearTimeout(existing);
  const timer = setTimeout(() => {
    expiryTimers.delete(key);
    const threadMap = state[threadId];
    if (!threadMap || !(accountId in threadMap)) return;
    const nextThreadMap = { ...threadMap };
    delete nextThreadMap[accountId];
    const next = { ...state };
    if (Object.keys(nextThreadMap).length === 0) {
      delete next[threadId];
    } else {
      next[threadId] = nextThreadMap;
    }
    setState(next);
  }, TYPING_TTL_MS);
  expiryTimers.set(key, timer);
};

const recordTyping = (
  threadId: string,
  accountId: string,
  typingAt: string
) => {
  const nextThreadMap = { ...(state[threadId] ?? {}), [accountId]: typingAt };
  setState({ ...state, [threadId]: nextThreadMap });
  scheduleExpiry(threadId, accountId);
};

const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = (): TypingMap => state;

/**
 * Read the typing-state map for a given thread. Returns `{ [accountId]: ISO }`.
 * Entries auto-expire after ~6s of inactivity.
 */
export const useThreadTyping = (
  threadId: string
): Record<string, string> => {
  const subscribeRef = React.useRef(subscribe);
  const getSnapshotRef = React.useRef(getSnapshot);

  const fullState = React.useSyncExternalStore(
    subscribeRef.current,
    getSnapshotRef.current,
    getSnapshotRef.current
  );

  return fullState[threadId] ?? {};
};

/**
 * Mount once at the provider level to wire `thread.typing` → in-memory store.
 */
export const ThreadTypingEffect = (): null => {
  const handler = React.useCallback(
    (payload: { threadId: string; accountId: string; typingAt: string }) => {
      recordTyping(payload.threadId, payload.accountId, payload.typingAt);
    },
    []
  );

  useWSEvent("thread.typing", handler);

  return null;
};

export default ThreadTypingEffect;
