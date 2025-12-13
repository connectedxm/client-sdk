import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { Account, ConnectedXMResponse } from "@interfaces";
import { ACCOUNTS_QUERY_KEY } from "./useGetAccounts";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNT_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACCOUNTS_QUERY_KEY(),
  accountId,
];

export const SET_ACCOUNT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccount>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetAccountProps extends SingleQueryParams {
  accountId: string;
}

export const GetAccount = async ({
  accountId,
  clientApiParams,
}: GetAccountProps): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/${accountId}`);
  return data;
};

export const useGetAccount = (
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccount>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccount>>(
    ACCOUNT_QUERY_KEY(accountId),
    (_params) => GetAccount({ accountId, ..._params }),
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
