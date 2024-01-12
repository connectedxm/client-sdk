import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import { AccountShare } from "@interfaces";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const ACCOUNT_BY_SHARE_CODE_QUERY_KEY = (shareCode: string) => [
  "ACCOUNT_BY_SHARE_CODE",
  shareCode,
];

export const SET_ACCOUNT_BY_SHARE_CODE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountByShareCode>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNT_BY_SHARE_CODE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetAccountByShareCodeProps extends SingleQueryParams {
  shareCode: string;
}

export const GetAccountByShareCode = async ({
  shareCode,
  locale,
}: GetAccountByShareCodeProps): Promise<ConnectedXMResponse<AccountShare>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/accounts/shareCode/${shareCode}`);
  return data;
};

const useGetAccountByShareCode = (shareCode: string) => {
  return useConnectedSingleQuery<ConnectedXMResponse<AccountShare>>(
    ACCOUNT_BY_SHARE_CODE_QUERY_KEY(shareCode),
    (params) =>
      GetAccountByShareCode({ shareCode: shareCode || "unknown", ...params }),
    {
      enabled: !!shareCode,
      retry: false,
    }
  );
};

export default useGetAccountByShareCode;
