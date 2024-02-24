import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Community } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { COMMUNITY_QUERY_KEY } from "../communities/useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNT_COMMUNITIES_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "COMMUNITIES",
];

export const SET_ACCOUNT_COMMUNITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_COMMUNITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountCommunities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNT_COMMUNITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetAccountCommunitiesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountCommunities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  queryClient,
  clientApiParams,
  locale,
}: GetAccountCommunitiesProps): Promise<ConnectedXMResponse<Community[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/${accountId}/communities`, {
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
      (communityId) => COMMUNITY_QUERY_KEY(communityId),
      locale
    );
  }

  return data;
};

export const useGetAccountCommunities = (
  accountId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountCommunities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountCommunities>>
  >(
    ACCOUNT_COMMUNITIES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountCommunities({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
