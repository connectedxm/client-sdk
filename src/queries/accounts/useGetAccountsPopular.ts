import type { Account, AccountType } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACCOUNTS_QUERY_KEY } from "./useGetAccounts";

export const ACCOUNTS_POPULAR_QUERY_KEY = (
  accountType?: keyof typeof AccountType
): QueryKey => {
  const keys = [...ACCOUNTS_QUERY_KEY(accountType), "POPULAR"];
  return keys;
};

export const SET_ACCOUNTS_POPULAR_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNTS_POPULAR_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountsPopular>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNTS_POPULAR_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetAccountsPopularProps extends InfiniteQueryParams {
  accountType?: keyof typeof AccountType;
}

export const GetAccountsPopular = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountType,
  clientApiParams,
}: GetAccountsPopularProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/popular`, {
    params: {
      accountType: accountType || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountsPopular = (
  accountType?: keyof typeof AccountType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountsPopular>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountsPopular>>
  >(
    ACCOUNTS_POPULAR_QUERY_KEY(accountType),
    (params: InfiniteQueryParams) =>
      GetAccountsPopular({ ...params, accountType }),
    params,
    {
      ...options,
    }
  );
};
