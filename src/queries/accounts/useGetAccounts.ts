import type { Account, AccountType } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNTS_QUERY_KEY = (
  accountType?: keyof typeof AccountType
): QueryKey => {
  const keys = ["ACCOUNTS"];
  if (accountType) {
    keys.push(accountType);
  }
  return keys;
};

export const SET_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccounts>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetAccountsProps extends InfiniteQueryParams {
  accountType?: keyof typeof AccountType;
}

export const GetAccounts = async ({
  pageSize,
  orderBy,
  search,
  accountType,
  queryClient,
  clientApiParams,
  locale,
}: GetAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts`, {
    params: {
      accountType: accountType || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (accountId) => ACCOUNT_QUERY_KEY(accountId),
      locale
    );
  }

  return data;
};

export const useGetAccounts = (
  accountType?: keyof typeof AccountType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetAccounts>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccounts>>>(
    ACCOUNTS_QUERY_KEY(accountType),
    (params: InfiniteQueryParams) => GetAccounts({ ...params, accountType }),
    params,
    {
      ...options,
    }
  );
};
