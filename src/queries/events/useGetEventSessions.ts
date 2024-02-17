import type { ConnectedXMResponse, Session } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

export const EVENT_SESSIONS_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_QUERY_KEY(eventId),
  "SESSIONS",
];

export const SET_EVENT_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessions>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SESSIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventSessionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSessions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetEventSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const { data } = await clientApi.get(`/events/${eventId}/sessions`, {
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
      (sessionId) => EVENT_SESSION_QUERY_KEY(eventId, sessionId),
      locale
    );
  }

  return data;
};

export const useGetEventSessions = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessions>>
  >(
    EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventSessions({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
