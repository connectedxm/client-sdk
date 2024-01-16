import { ClientAPI } from "@src/ClientAPI";
import type { ConnectedXMResponse, Session } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import {
  EVENT_SESSION_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "./useGetEventSession";

export const EVENT_SESSIONS_QUERY_KEY = (eventId: string) => [
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

interface GetEventSessionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSessions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
  queryClient,
}: GetEventSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const clientApi = await ClientAPI(locale);
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
      SET_EVENT_SESSION_QUERY_DATA
    );
  }

  return data;
};

const useGetEventSessions = (
  eventId: string,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetEventSessions>> = {}
) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventSessions>>(
    EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventSessions({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventSessions;
