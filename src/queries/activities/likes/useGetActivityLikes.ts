import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { ActivityLike } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ACTIVITY_QUERY_KEY } from "../useGetActivity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACTIVITY_LIKES_QUERY_KEY = (activityId: string): QueryKey => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "ACTIVITY_LIKES",
];

export const SET_ACTIVITY_LIKES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_LIKES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityLikes>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACTIVITY_LIKES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetActivityLikesProps extends InfiniteQueryParams {
  activityId: string;
}

export const GetActivityLikes = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetActivityLikesProps): Promise<ConnectedXMResponse<ActivityLike[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/activities/${activityId}/likes`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetActivityLikes = (
  activityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetActivityLikes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityLikes>>
  >(
    ACTIVITY_LIKES_QUERY_KEY(activityId),
    (params: InfiniteQueryParams) =>
      GetActivityLikes({ activityId, ...params }),
    params,
    {
      enabled: !!activityId && (options?.enabled ?? true),
      ...options,
    }
  );
};
