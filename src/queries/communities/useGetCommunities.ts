import type { Community } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const COMMUNITIES_QUERY_KEY = (): QueryKey => ["COMMUNITIES"];

export const SET_COMMUNITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetCommunitiesProps extends InfiniteQueryParams {
  privateCommunities?: boolean;
}

export const GetCommunities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  privateCommunities,
  queryClient,
  clientApiParams,
  locale,
}: GetCommunitiesProps): Promise<ConnectedXMResponse<Community[]>> => {
  if (privateCommunities) {
    return {
      status: "ok",
      message: "Communities retreived",
      data: [],
    };
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/communities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      privateCommunities: privateCommunities || undefined,
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

export const useGetCommunities = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetCommunities>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetCommunities>>>(
    COMMUNITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetCommunities({ ...params }),
    params,
    options
  );
};
