/* eslint-disable @typescript-eslint/no-unused-vars */

import { ThreadMessage } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

export interface WSThreadMessageCreated {
  timestamp: number;
  type: "thread.message.created";
  body: {
    threadId: string;
    message: ThreadMessage;
  };
}

const ThreadMessageCreated = (
  _queryClient: QueryClient,
  _locale: string,
  _message: WSThreadMessageCreated
) => {
  return;
};

export default ThreadMessageCreated;
