import { WSNewChatMessage } from "./chat/ChatNewMessage";
import { WSThreadMessageCreated } from "./threads/messages/ThreadMessageCreated";
import { WSThreadMessageUpdated } from "./threads/messages/ThreadMessageUpdated";
import { WSThreadMessageDeleted } from "./threads/messages/ThreadMessageDeleted";

export interface SendWSMessage {
  type: string;
  body: object;
}

export type ReceivedWSMessage =
  | WSNewChatMessage
  | WSThreadMessageCreated
  | WSThreadMessageUpdated
  | WSThreadMessageDeleted;
