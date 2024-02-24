import axios, { AxiosInstance } from "axios";

export type API_URL =
  | "https://client-api.connectedxm.com"
  | "https://staging-client-api.connectedxm.com"
  | "http://localhost:4001"
  | string;

export const getClientAPI = (
  apiUrl: API_URL,
  organizationId: string,
  getToken: () => string | undefined,
  getExecuteAs?: () => string | undefined,
  locale?: string
): AxiosInstance => {
  return axios.create({
    baseURL: apiUrl,
    headers: {
      authorization: getToken(),
      executeAs: getExecuteAs ? getExecuteAs() : undefined,
      organization: organizationId,
      locale: locale,
    },
  });
};
