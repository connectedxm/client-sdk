import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ACTIVITY_QUERY_KEY } from "../activities/useGetActivity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const COMMUNITY_ACTIVITIES_QUERY_KEY = (
  communityId: string
): QueryKey => [...COMMUNITY_QUERY_KEY(communityId), "ACTIVITIES"];

export const SET_COMMUNITY_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityActivities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_ACTIVITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetCommunityActivitiesProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  queryClient,
  clientApiParams,
  locale,
}: GetCommunityActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/communities/${communityId}/activities`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (activityId) => ACTIVITY_QUERY_KEY(activityId),
      locale
    );
  }

  return data;
};

export const useGetCommunityActivities = (
  communityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityActivities>>
  >(
    COMMUNITY_ACTIVITIES_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityActivities({ communityId, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
