import axios, { AxiosInstance } from "axios";

export interface ClientApiParams {
  apiUrl:
    | "https://client-api.connectedxm.com"
    | "https://staging-client-api.connectedxm.com"
    | "http://localhost:4001";
  organizationId: string;
  getToken: () => Promise<string | undefined> | string | undefined;
  getExecuteAs?: () => Promise<string | undefined> | string | undefined;
  locale: string;
}

export const GetClientAPI = async (
  params: ClientApiParams
): Promise<AxiosInstance> => {
  const token = await params.getToken();
  const executeAs = params.getExecuteAs
    ? await params.getExecuteAs()
    : undefined;

  return axios.create({
    baseURL: params.apiUrl,
    headers: {
      organization: params.organizationId,
      locale: params.locale,
      authorization: token,
      executeAs: executeAs,
    },
  });
};
