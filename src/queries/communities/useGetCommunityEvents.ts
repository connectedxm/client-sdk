import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Event } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "../events/useGetEvent";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const COMMUNITY_EVENTS_QUERY_KEY = (
  communityId: string,
  past?: boolean
): QueryKey => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "EVENTS",
  past ? "PAST" : "UPCOMING",
];

export const SET_COMMUNITY_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityEvents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_EVENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetCommunityEventsProps extends InfiniteQueryParams {
  communityId: string;
  past?: boolean;
}

export const GetCommunityEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  communityId,
  past,
  queryClient,
  clientApiParams,
  locale,
}: GetCommunityEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/communities/${communityId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past || false,
    },
  });
  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (eventId) => EVENT_QUERY_KEY(eventId),
      locale
    );
  }

  return data;
};

export const useGetCommunityEvents = (
  communityId: string,
  past: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCommunityEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityEvents>>
  >(
    COMMUNITY_EVENTS_QUERY_KEY(communityId, past),
    (params: InfiniteQueryParams) =>
      GetCommunityEvents({ communityId, past, ...params }),
    params,
    {
      ...options,
      enabled: !!communityId && (options?.enabled ?? true),
    }
  );
};
