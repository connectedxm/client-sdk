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
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { COMMUNITY_REQUEST_QUERY_KEY } from "./useGetCommunityRequest";

export const COMMUNITY_REQUESTS_QUERY_KEY = (communityId: string): QueryKey => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "REQUESTS",
];

export const SET_COMMUNITY_REQUESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_REQUESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityRequests>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_REQUESTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetCommunityRequestsProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityRequests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  queryClient,
  clientApiParams,
  locale,
}: GetCommunityRequestsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/communities/${communityId}/requests`, {
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
      (communityId) => COMMUNITY_REQUEST_QUERY_KEY(communityId),
      locale
    );
  }

  return data;
};

export const useGetCommunityRequests = (
  communityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityRequests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityRequests>>
  >(
    COMMUNITY_REQUESTS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityRequests({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
