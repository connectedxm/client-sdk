import axios, { AxiosInstance } from "axios";
import { useConnectedXM } from "./useConnectedXM";

export const useClientAPI = (locale?: string): AxiosInstance => {
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
