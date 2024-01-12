import axios from "axios";
import React from "react";
import { ConnectedXMContext } from "./Context";

export const DELEGATION_KEY = "EXECUTING_AS";
export const LOCALE_KEY = "LOCALE";

export interface ConnectedXMResponse<TData> {
  status: "ok" | "error" | "redirect";
  message: string;
  data: TData;
  count?: number;
  url?: string;
}

export const ClientAPI = async (locale?: string) => {
  const { apiUrl, authToken, organizationId, executeAs } =
    React.useContext(ConnectedXMContext);

  const api = axios.create({
    baseURL: apiUrl,
    headers: {
      authorization: authToken,
      organization: organizationId,
      executeAs: executeAs,
      locale: !!locale && locale !== "en" ? locale : undefined,
    },
  });

  return api;
};
