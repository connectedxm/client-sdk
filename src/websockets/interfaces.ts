import { WSStreamChatCreated } from "./stream/StreamChatCreated";
import { WSStreamChatDeleted } from "./stream/StreamChatDeleted";
import { WSStreamChatUpdated } from "./stream/StreamChatUpdated";
import { WSStreamConnected } from "./stream/StreamConnected";
import { WSStreamDisconnected } from "./stream/StreamDisconnected";
import { WSPulseMessage } from "./PulseMessage";
import type { ThreadMessage } from "@src/interfaces";

export interface StreamConnectMessage {
  type: "stream.connect";
  streamId: string;
}

export interface StreamDisconnectMessage {
  type: "stream.disconnect";
}

export interface HeartbeatMessage {
  type: "heartbeat";
}

export interface ThreadSubscribeMessage {
  type: "thread.subscribe";
  threadId: string;
}

export interface ThreadUnsubscribeMessage {
  type: "thread.unsubscribe";
  threadId: string;
}

export type SendWSMessage =
  | StreamConnectMessage
  | StreamDisconnectMessage
  | HeartbeatMessage
  | ThreadSubscribeMessage
  | ThreadUnsubscribeMessage;

export interface WSThreadMessageCreated {
  timestamp: number;
  type: "thread.message.created";
  body: { threadId: string; message: ThreadMessage };
}

export interface WSThreadMessageUpdated {
  timestamp: number;
  type: "thread.message.updated";
  body: { threadId: string; message: ThreadMessage };
}

export interface WSThreadMessageDeleted {
  timestamp: number;
  type: "thread.message.deleted";
  body: { threadId: string; messageId: string };
}

export interface WSThreadRead {
  timestamp: number;
  type: "thread.read";
  body: {
    threadId: string;
    accountId: string;
    messageId?: string;
    readAt: string;
  };
}

export interface WSThreadTyping {
  timestamp: number;
  type: "thread.typing";
  body: { threadId: string; accountId: string; typingAt: string };
}

export type ReceivedWSMessage =
  | WSThreadMessageCreated
  | WSThreadMessageUpdated
  | WSThreadMessageDeleted
  | WSThreadRead
  | WSThreadTyping
  | WSStreamChatCreated
  | WSStreamChatDeleted
  | WSStreamChatUpdated
  | WSStreamConnected
  | WSStreamDisconnected
  | WSPulseMessage;
