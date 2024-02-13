import type { Community } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient } from "@tanstack/react-query";
import {
  COMMUNITY_QUERY_KEY,
  SET_COMMUNITY_QUERY_DATA,
} from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";

export const COMMUNITIES_QUERY_KEY = () => ["COMMUNITIES"];

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

interface GetCommunitiesProps extends InfiniteQueryParams {
  privateCommunities?: boolean;
}

export const GetCommunities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  privateCommunities,
  queryClient,
  clientApi,
}: GetCommunitiesProps): Promise<ConnectedXMResponse<Community[]>> => {
  if (privateCommunities) {
    return {
      status: "ok",
      message: "Communities retreived",
      data: [],
    };
  }

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
      SET_COMMUNITY_QUERY_DATA
    );
  }

  return data;
};

export const useGetCommunities = (
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetCommunities>> = {}
) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetCommunities>>(
    COMMUNITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetCommunities({ ...params }),
    params,
    options
  );
};
