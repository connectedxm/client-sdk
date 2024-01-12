import { ClientAPI } from "@src/ClientAPI";
import type { Session } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { SET_EVENT_SESSION_QUERY_DATA } from "./useGetEventSession";
import { EVENT_QUERY_KEY } from "./useGetEvent";

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
  return data;
};

const useGetEventSessions = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessions>>
  >(
    EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventSessions({ eventId, ...params }),
    {
      enabled: !!eventId,
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

export default useGetEventSessions;
