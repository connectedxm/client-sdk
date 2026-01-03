/* eslint-disable @typescript-eslint/no-unused-vars */

import { QueryClient } from "@tanstack/react-query";

export interface WSStreamConnected {
  timestamp: number;
  type: "stream.connected";
  body: {
    streamId: string;
    sessionId: string;
  };
}

const StreamConnected = (
  _queryClient: QueryClient,
  _locale: string,
  _message: WSStreamConnected
) => {
  return;
};

export default StreamConnected;
