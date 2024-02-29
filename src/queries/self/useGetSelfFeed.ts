import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity, ConnectedXMResponse } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ACTIVITY_QUERY_KEY } from "../activities/useGetActivity";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_FEED_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "FEED",
];

export interface GetSelfFeedProps extends InfiniteQueryParams {}

export const GetSelfFeed = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetSelfFeedProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/activities/feed`, {
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
      (activityId) => ACTIVITY_QUERY_KEY(activityId),
      locale
    );
  }

  return data;
};

export const useGetSelfFeed = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSelfFeed>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfFeed>>>(
    SELF_FEED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfFeed(params),
    params,
    {
      ...options,
      enabled: options.enabled ?? true,
    }
  );
};
