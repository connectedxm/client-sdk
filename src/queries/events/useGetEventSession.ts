import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import type { Session } from "@interfaces";
import { EVENT_SESSIONS_QUERY_KEY } from "./useGetEventSessions";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_SESSION_QUERY_KEY = (eventId: string, sessionId: string) => [
  ...EVENT_SESSIONS_QUERY_KEY(eventId),
  sessionId,
];

export const SET_EVENT_SESSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSession>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SESSION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetEventSessionProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSession = async ({
  eventId,
  sessionId,
  locale,
}: GetEventSessionProps): Promise<ConnectedXMResponse<Session>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(
    `/events/${eventId}/sessions/${sessionId}`
  );
  return data;
};

const useGetEventSession = (eventId: string, sessionId: string) => {
  return useConnectedSingleQuery<Awaited<ReturnType<typeof GetEventSession>>>(
    EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    (params) => GetEventSession({ eventId, sessionId, ...params }),
    {
      enabled: !!eventId && !!sessionId,
    }
  );
};

export default useGetEventSession;
