import type { Account } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { ConnectedXMResponse } from "@interfaces";

export const ACCOUNTS_QUERY_KEY = (): QueryKey => ["ACCOUNTS"];

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

interface GetAccountsProps extends InfiniteQueryParams {}

export const GetAccounts = async ({
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const { data } = await clientApi.get(`/accounts`, {
    params: {
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
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetAccounts>>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccounts>>>(
    ACCOUNTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetAccounts({ ...params }),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};
