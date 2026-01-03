/* eslint-disable @typescript-eslint/no-unused-vars */

import { QueryClient } from "@tanstack/react-query";

export interface WSStreamDisconnected {
  timestamp: number;
  type: "stream.disconnected";
  body: {};
}

const StreamDisconnected = (
  _queryClient: QueryClient,
  _locale: string,
  _message: WSStreamDisconnected
) => {
  return;
};

export default StreamDisconnected;
