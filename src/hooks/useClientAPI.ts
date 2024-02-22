import axios, { AxiosInstance } from "axios";
import { useConnectedXM } from "./useConnectedXM";

export const getClientAPI = (
  apiUrl:
    | "https://client-api.connectedxm.com"
    | "https://staging-client-api.connectedxm.com"
    | "http://localhost:4001",
  organizationId: string,
  token?: string,
  executeAs?: string,
  locale?: string
): AxiosInstance => {
  return axios.create({
    baseURL: apiUrl,
    headers: {
      authorization: token,
      organization: organizationId,
      executeAs: executeAs,
      locale: locale,
    },
  });
};

export const useClientAPI = (locale?: string): AxiosInstance => {
  const {
    apiUrl,
    token,
    organizationId,
    executeAs,
    locale: _locale,
  } = useConnectedXM();

  return getClientAPI(
    apiUrl,
    organizationId,
    token,
    executeAs,
    locale || _locale
  );
};
