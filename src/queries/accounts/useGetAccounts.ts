import type { Account, AccountType } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
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

export interface GetAccountsProps extends InfiniteQueryParams {
  accountType?: keyof typeof AccountType;
}

export const GetAccounts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountType,
  clientApiParams,
}: GetAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts`, {
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
