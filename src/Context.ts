import React from "react";
import type { QueryClient } from "@tanstack/react-query";

export interface ContextValue {
  organizationId: string;
  apiUrl:
    | "https://api.connectedxm.app"
    | "https://staging-api.connectedxm.app"
    | "http://localhost:4001";
  queryClient: QueryClient;
  authToken?: string;
  setAuthToken: (token?: string) => void;
  executeAs?: string;
  locale?: string;
}

const Context = React.createContext<ContextValue>({} as ContextValue);

export default Context;
