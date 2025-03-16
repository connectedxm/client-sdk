import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { AccountShare } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNT_BY_SHARE_CODE_QUERY_KEY = (
  shareCode: string
): QueryKey => ["ACCOUNT_BY_SHARE_CODE", shareCode];

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
