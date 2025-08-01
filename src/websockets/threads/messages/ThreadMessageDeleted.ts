/* eslint-disable @typescript-eslint/no-unused-vars */

import { QueryClient } from "@tanstack/react-query";

export interface WSThreadMessageDeleted {
  timestamp: number;
  type: "thread.message.deleted";
  body: {
    threadId: string;
    messageId: string;
  };
}

const ThreadMessageDeleted = (
  _queryClient: QueryClient,
  _locale: string,
  _message: WSThreadMessageDeleted
) => {
  return;
};

export default ThreadMessageDeleted;
