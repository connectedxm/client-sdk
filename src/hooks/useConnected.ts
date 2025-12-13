import {
  ConnectedXMClientContext,
  ConnectedXMClientContextState,
} from "@src/ConnectedXMProvider";
import React from "react";

export const useConnected = () => {
  const context = React.useContext<ConnectedXMClientContextState>(
    ConnectedXMClientContext
  );

  if (!context) {
    throw new Error("useConnected must be used within a ConnectedXMProvider");
  }

  return context;
};

export default useConnected;
