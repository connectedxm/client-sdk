import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { ConnectedXMResponse, Session } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import {
  EVENT_SESSION_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "../events/useGetEventSession";
import { SELF_EVENTS_QUERY_KEY } from "./useGetSelfEvents";

export const SELF_EVENT_SESSIONS_QUERY_KEY = (eventId: string) => [
  ...SELF_EVENTS_QUERY_KEY(false),
  eventId,
  "SESSIONS",
];

interface GetSelfEventSessionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventSessions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
  queryClient,
}: GetSelfEventSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/events/${eventId}/sessions`, {
    params: {
      eventId: eventId || undefined,
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

const useGetSelfEventSessions = (
  eventId: string,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetSelfEventSessions>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetSelfEventSessions>>(
    SELF_EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventSessions({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!eventId && (options.enabled ?? true),
    }
  );
};

export default useGetSelfEventSessions;
