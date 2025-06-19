import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Account } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNT_FOLLOWERS_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "FOLLOWERS",
];

export const SET_ACCOUNT_FOLLOWERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_FOLLOWERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountFollowers>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNT_FOLLOWERS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetAccountFollowersProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountFollowers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  queryClient,
  clientApiParams,
  locale,
}: GetAccountFollowersProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/${accountId}/followers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });return data;
};

export const useGetAccountFollowers = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountFollowers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountFollowers>>
  >(
    ACCOUNT_FOLLOWERS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountFollowers({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
