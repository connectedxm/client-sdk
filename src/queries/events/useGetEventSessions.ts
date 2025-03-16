import type { ConnectedXMResponse, Session } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { GetClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";

export const EVENT_SESSIONS_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_QUERY_KEY(eventId),
  "SESSIONS",
];

export interface GetEventSessionsProps extends SingleQueryParams {
  eventId: string;
  search?: string;
}

export const GetEventSessions = async ({
  eventId,
  search,
  clientApiParams,
}: GetEventSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/sessions`, {
    params: { search: search || undefined },
  });

  return data;
};

export const useGetEventSessions = (
  eventId: string = "",
  search?: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventSessions>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessions>>(
    EVENT_SESSIONS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventSessions({ eventId, search, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
