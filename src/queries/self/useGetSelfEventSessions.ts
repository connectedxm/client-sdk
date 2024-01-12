import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import type { Session } from "@interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_SESSION_QUERY_DATA } from "../events/useGetEventSession";
import { SELF_EVENTS_QUERY_KEY } from "./useGetSelfEvents";

export const SELF_EVENT_SESSIONS_QUERY_KEY = (eventId: string) => [
  ...SELF_EVENTS_QUERY_KEY(),
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
  return data;
};

const useGetSelfEventSessions = (eventId: string) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventSessions>>
  >(
    SELF_EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventSessions({ eventId, ...params }),
    {
      enabled: !!token && !!eventId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (sessionId) => [eventId, sessionId],
          SET_EVENT_SESSION_QUERY_DATA
        ),
    }
  );
};

export default useGetSelfEventSessions;
