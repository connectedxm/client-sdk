import React from "react";
import Context, { ContextValue } from "../Context";

export const useConnectedXM = () => {
  const context = React.useContext<ContextValue>(Context);
  if (!context) {
    throw new Error("useConnectedXM must be used within a ConnectedXMProvider");
  }
  return context;
};
