import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity } from "@interfaces";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { SET_ACTIVITY_QUERY_DATA } from "../activities/useGetActivity";
import { ConnectedXMResponse } from "@interfaces";

export const COMMUNITY_ACTIVITIES_QUERY_KEY = (communityId: string) => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "ACTIVITIES",
];

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

interface GetCommunityActivitiesProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  locale,
}: GetCommunityActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await ClientAPI(locale);
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
  return data;
};

const useGetCommunityActivities = (communityId: string) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityActivities>>
  >(
    COMMUNITY_ACTIVITIES_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityActivities({ communityId, ...params }),
    {
      enabled: !!token && !!communityId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (activityId) => [activityId],
          SET_ACTIVITY_QUERY_DATA
        ),
    }
  );
};

export default useGetCommunityActivities;
