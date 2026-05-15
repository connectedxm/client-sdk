import React from "react";
import type { ThreadMessage } from "@src/interfaces";

/**
 * Typed event payload map for socket events broadcast by the backend.
 *
 * Add new entries here (NOT via `any`) when introducing new event types.
 */
export interface WSEventPayloadMap {
  "thread.message.created": {
    threadId: string;
    message: ThreadMessage;
  };
  "thread.message.updated": {
    threadId: string;
    message: ThreadMessage;
  };
  "thread.message.deleted": {
    threadId: string;
    messageId: string;
  };
  "thread.read": {
    threadId: string;
    accountId: string;
    messageId?: string;
    readAt: string;
  };
  "thread.typing": {
    threadId: string;
    accountId: string;
    typingAt: string;
  };
}

export type WSEventName = keyof WSEventPayloadMap;

export type WSEventHandler<E extends WSEventName> = (
  payload: WSEventPayloadMap[E]
) => void;

/**
 * Loose envelope describing what comes off the wire. The backend may put the
 * event name on `event` (new style) or `type` (legacy) - we accept both.
 */
export interface WSEnvelope {
  event?: string;
  type?: string;
  body?: any;
  payload?: any;
  [key: string]: any;
}

/**
 * Typed pub/sub for socket events.
 *
 * Consumers `register(event, handler)` and receive a disposer. Producers
 * `dispatch(envelope)` and the bus routes it to the handlers registered for
 * the matching event name.
 */
export class WSMessageBus {
  private handlers: Map<string, Set<(payload: any) => void>> = new Map();

  register<E extends WSEventName>(
    event: E,
    handler: WSEventHandler<E>
  ): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(handler as (payload: any) => void);

    return () => {
      const current = this.handlers.get(event);
      if (current) {
        current.delete(handler as (payload: any) => void);
        if (current.size === 0) {
          this.handlers.delete(event);
        }
      }
    };
  }

  dispatch(envelope: WSEnvelope | null | undefined): void {
    if (!envelope) return;

    const eventName = (envelope.event ?? envelope.type) as
      | WSEventName
      | undefined;
    if (!eventName) return;

    const handlers = this.handlers.get(eventName);
    if (!handlers || handlers.size === 0) return;

    const payload = envelope.body ?? envelope.payload ?? envelope;
    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        // Swallow handler errors so one bad consumer can't break the bus.
        // eslint-disable-next-line no-console
        console.error(`[WSMessageBus] handler for "${eventName}" threw`, err);
      }
    });
  }

  clear(): void {
    this.handlers.clear();
  }
}

const WSMessageBusContext = React.createContext<WSMessageBus | null>(null);

export interface WSMessageBusProviderProps {
  bus?: WSMessageBus;
  children: React.ReactNode;
}

export const WSMessageBusProvider = ({
  bus,
  children,
}: WSMessageBusProviderProps) => {
  const ref = React.useRef<WSMessageBus | null>(null);
  if (!ref.current) {
    ref.current = bus ?? new WSMessageBus();
  }

  return (
    <WSMessageBusContext.Provider value={ref.current}>
      {children}
    </WSMessageBusContext.Provider>
  );
};

export const useWSMessageBus = (): WSMessageBus => {
  const ctx = React.useContext(WSMessageBusContext);
  if (!ctx) {
    throw new Error(
      "useWSMessageBus must be used within a WSMessageBusProvider"
    );
  }
  return ctx;
};

/**
 * Register a typed handler for a socket event. Disposes on unmount or when
 * `event`/`handler` identity changes.
 */
export const useWSEvent = <E extends WSEventName>(
  event: E,
  handler: WSEventHandler<E>
): void => {
  const bus = useWSMessageBus();
  React.useEffect(() => {
    return bus.register(event, handler);
  }, [bus, event, handler]);
};
