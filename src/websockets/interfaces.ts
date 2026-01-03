import { WSNewChatMessage } from "./chat/ChatNewMessage";
import { WSThreadMessageCreated } from "./threads/messages/ThreadMessageCreated";
import { WSThreadMessageUpdated } from "./threads/messages/ThreadMessageUpdated";
import { WSThreadMessageDeleted } from "./threads/messages/ThreadMessageDeleted";
import { WSStreamChatCreated } from "./stream/StreamChatCreated";
import { WSStreamChatDeleted } from "./stream/StreamChatDeleted";
import { WSStreamChatUpdated } from "./stream/StreamChatUpdated";
import { WSStreamConnected } from "./stream/StreamConnected";
import { WSStreamDisconnected } from "./stream/StreamDisconnected";
import { WSPulseMessage } from "./PulseMessage";

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

export type SendWSMessage =
  | StreamConnectMessage
  | StreamDisconnectMessage
  | HeartbeatMessage;

export type ReceivedWSMessage =
  | WSNewChatMessage
  | WSThreadMessageCreated
  | WSThreadMessageUpdated
  | WSThreadMessageDeleted
  | WSStreamChatCreated
  | WSStreamChatDeleted
  | WSStreamChatUpdated
  | WSStreamConnected
  | WSStreamDisconnected
  | WSPulseMessage;
