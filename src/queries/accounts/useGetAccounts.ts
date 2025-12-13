import type { Account } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNTS_QUERY_KEY = (): QueryKey => {
  const keys = ["ACCOUNTS"];
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

export interface GetAccountsProps extends InfiniteQueryParams {}

export const GetAccounts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccounts = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetAccounts>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccounts>>>(
    ACCOUNTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetAccounts(params),
    params,
    {
      ...options,
    }
  );
};
