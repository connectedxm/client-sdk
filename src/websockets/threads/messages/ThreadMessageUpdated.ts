/* eslint-disable @typescript-eslint/no-unused-vars */

import { ThreadMessage } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

export interface WSThreadMessageUpdated {
  timestamp: number;
  type: "thread.message.updated";
  body: {
    threadId: string;
    message: ThreadMessage;
  };
}

const ThreadMessageUpdated = (
  _queryClient: QueryClient,
  _locale: string,
  _message: WSThreadMessageUpdated
) => {
  return;
};

export default ThreadMessageUpdated;
