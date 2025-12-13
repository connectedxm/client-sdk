import type { ConnectedXMResponse, Session } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { SELF_EVENTS_QUERY_KEY } from "./useGetSelfEvents";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_EVENT_SESSIONS_QUERY_KEY = (eventId: string): QueryKey => [
  ...SELF_EVENTS_QUERY_KEY(false),
  eventId,
  "SESSIONS",
];

export interface GetSelfEventSessionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventSessions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfEventSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/${eventId}/sessions`, {
    params: {
      eventId: eventId || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetSelfEventSessions = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventSessions>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventSessions>>
  >(
    SELF_EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventSessions({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
