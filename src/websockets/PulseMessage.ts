/* eslint-disable @typescript-eslint/no-unused-vars */

import { QueryClient } from "@tanstack/react-query";

export interface WSPulseMessage {
  timestamp?: number;
  type: "pulse";
}

const PulseMessage = (
  _queryClient: QueryClient,
  _locale: string,
  _message: WSPulseMessage
) => {
  return;
};

export default PulseMessage;
