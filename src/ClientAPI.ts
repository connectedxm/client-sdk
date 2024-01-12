import axios from "axios";
import { useConnectedXM } from "./hooks/useConnectedXM";

export const ClientAPI = async (locale?: string) => {
  const {
    apiUrl,
    token,
    organizationId,
    executeAs,
    locale: _locale,
  } = useConnectedXM();

  const api = axios.create({
    baseURL: apiUrl,
    headers: {
      authorization: token,
      organization: organizationId,
      executeAs: executeAs,
      locale: locale || _locale,
    },
  });

  return api;
};
