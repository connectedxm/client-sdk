import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Session } from "@interfaces";
import { EVENT_SESSIONS_QUERY_KEY } from "./useGetEventSessions";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_SESSION_QUERY_KEY = (
  eventId: string,
  sessionId: string
): QueryKey => [...EVENT_SESSIONS_QUERY_KEY(eventId), sessionId];

export interface GetEventSessionProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSession = async ({
  eventId,
  sessionId,
  clientApiParams,
}: GetEventSessionProps): Promise<ConnectedXMResponse<Session>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/sessions/${sessionId}`
  );
  return data;
};

export const useGetEventSession = (
  eventId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSession>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSession>>(
    EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    (params) => GetEventSession({ eventId, sessionId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options?.enabled ?? true),
    }
  );
};
