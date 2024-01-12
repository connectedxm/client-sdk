import { ConnectedXMContext } from "@/ConnectedXMClient";
import React from "react";

export const useConnectedXMContext = () => {
  const context = React.useContext(ConnectedXMContext);
  if (!context) {
    throw new Error(
      "useConnectedXMContext must be used within a ConnectedXMProvider"
    );
  }
  return context;
};
