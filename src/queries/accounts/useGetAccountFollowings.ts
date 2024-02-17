import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Account } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { ConnectedXMResponse } from "@interfaces";

export const ACCOUNT_FOLLOWINGS_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "FOLLOWINGS",
];

export const SET_ACCOUNT_FOLLOWINGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_FOLLOWINGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountFollowings>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNT_FOLLOWINGS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetAccountFollowingsProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountFollowings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  queryClient,
  clientApi,
  locale,
}: GetAccountFollowingsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const { data } = await clientApi.get(`/accounts/${accountId}/following`, {
    params: {
      page: pageParam || undefined,
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

export const useGetAccountFollowings = (
  accountId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountFollowings>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountFollowings>>
  >(
    ACCOUNT_FOLLOWINGS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountFollowings({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!accountId && (options?.enabled ?? true),
    }
  );
};
