import type { Activity } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ACTIVITY_QUERY_KEY } from "../activities/useGetActivity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACTIVITIES_QUERY_KEY } from "../activities";

export const EVENT_ACTIVITIES_QUERY_KEY = (eventId: string): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
  ...EVENT_QUERY_KEY(eventId),
];

export const SET_EVENT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ACTIVITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventActivitiesProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventActivities = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetEventActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });return data;
};

export const useGetEventActivities = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivities>>
  >(
    EVENT_ACTIVITIES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventActivities({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
