import type { ConnectedXMResponse, Session } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { GetClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";

export const EVENT_SESSIONS_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_QUERY_KEY(eventId),
  "SESSIONS",
];

export const SET_EVENT_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SESSIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventSessionsProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventSessions = async ({
  eventId,
  clientApiParams,
}: GetEventSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/sessions`);

  return data;
};

export const useGetEventSessions = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessions>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessions>>(
    EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: SingleQueryParams) => GetEventSessions({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
