import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import ChatNewMessage, { WSNewChatMessage } from "./chat/ChatNewMessage";
import ThreadMessageCreated, {
  WSThreadMessageCreated,
} from "./threads/messages/ThreadMessageCreated";
import ThreadMessageUpdated, {
  WSThreadMessageUpdated,
} from "./threads/messages/ThreadMessageUpdated";
import ThreadMessageDeleted, {
  WSThreadMessageDeleted,
} from "./threads/messages/ThreadMessageDeleted";

export type WSMessage =
  | WSNewChatMessage
  | WSThreadMessageCreated
  | WSThreadMessageUpdated
  | WSThreadMessageDeleted;

interface UseWSProcessorProps {
  lastWSMessage: WSMessage | null;
  locale: string;
}

const useWSProcessor = ({ lastWSMessage, locale }: UseWSProcessorProps) => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!lastWSMessage) return;

    if (lastWSMessage.type === "new-message") {
      ChatNewMessage(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "thread.message.created") {
      ThreadMessageCreated(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "thread.message.updated") {
      ThreadMessageUpdated(queryClient, locale, lastWSMessage);
    } else if (lastWSMessage.type === "thread.message.deleted") {
      ThreadMessageDeleted(queryClient, locale, lastWSMessage);
    }
  });

  return;
};

export default useWSProcessor;
