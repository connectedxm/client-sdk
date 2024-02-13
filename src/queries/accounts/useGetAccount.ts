import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Account, ConnectedXMResponse } from "@interfaces";
import { ACCOUNTS_QUERY_KEY } from "./useGetAccounts";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks";

export const ACCOUNT_QUERY_KEY = (accountId: string) => [
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

interface GetAccountProps extends SingleQueryParams {
  accountId: string;
}

export const GetAccount = async ({
  accountId,
  clientApi,
}: GetAccountProps): Promise<ConnectedXMResponse<Account>> => {
  const { data } = await clientApi.get(`/accounts/${accountId}`);
  return data;
};

export const useGetAccount = (
  accountId: string,
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<ReturnType<typeof GetAccount>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetAccount>>(
    ACCOUNT_QUERY_KEY(accountId),
    (_params) => GetAccount({ accountId, ..._params }),
    params,
    {
      ...options,
      enabled: !!token && !!accountId && (options?.enabled ?? true),
    }
  );
};
