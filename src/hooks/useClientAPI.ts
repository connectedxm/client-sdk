import axios, { AxiosInstance } from "axios";
import { useConnectedXM } from "./useConnectedXM";
import { CLIENT_API_URL } from "@src/ConnectedXMProvider";

export const getClientAPI = (
  apiUrl: CLIENT_API_URL,
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
