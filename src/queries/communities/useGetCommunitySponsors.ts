import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Account } from "@interfaces";
import { QueryClient } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import {
  SET_SPONSOR_QUERY_DATA,
  SPONSOR_QUERY_KEY,
} from "../sponsors/useGetSponsor";
import { ConnectedXMResponse } from "@interfaces";

export const COMMUNITY_SPONSORS_QUERY_KEY = (communityId: string) => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "SPONSORS",
];

export const SET_COMMUNITY_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunitySponsors>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_SPONSORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetCommunitySponsorsProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunitySponsors = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  queryClient,
  clientApi,
}: GetCommunitySponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const { data } = await clientApi.get(`/communities/${communityId}/sponsors`, {
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
      (eventId) => SPONSOR_QUERY_KEY(eventId),
      SET_SPONSOR_QUERY_DATA
    );
  }

  return data;
};

export const useGetCommunitySponsors = (
  communityId: string,
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunitySponsors>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunitySponsors>>
  >(
    COMMUNITY_SPONSORS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunitySponsors({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
