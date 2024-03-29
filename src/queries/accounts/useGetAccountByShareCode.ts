import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { AccountShare } from "@interfaces";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNT_BY_SHARE_CODE_QUERY_KEY = (
  shareCode: string
): QueryKey => ["ACCOUNT_BY_SHARE_CODE", shareCode];

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

export interface GetAccountByShareCodeProps extends SingleQueryParams {
  shareCode: string;
}

export const GetAccountByShareCode = async ({
  shareCode,
  clientApiParams,
}: GetAccountByShareCodeProps): Promise<ConnectedXMResponse<AccountShare>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/shareCode/${shareCode}`);
  return data;
};

export const useGetAccountByShareCode = (
  shareCode: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccountByShareCode>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccountByShareCode>>(
    ACCOUNT_BY_SHARE_CODE_QUERY_KEY(shareCode),
    (params) =>
      GetAccountByShareCode({ shareCode: shareCode || "unknown", ...params }),
    {
      ...options,
      enabled: !!shareCode && (options?.enabled ?? true),
      retry: false,
    }
  );
};
