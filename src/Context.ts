import React from "react";
export interface ContextValue {
  organizationId: string;
  apiUrl:
    | "https://api.connectedxm.app"
    | "https://staging-api.connectedxm.app"
    | "http://localhost:4001";
  token?: string;
  setAuthToken: (token?: string) => void;
  executeAs?: string;
  locale: string;
}

const Context = React.createContext<ContextValue>({} as ContextValue);

export default Context;
