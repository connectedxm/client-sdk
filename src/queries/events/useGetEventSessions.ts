import type { ConnectedXMResponse, Session } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { GetClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";

export const EVENT_SESSIONS_QUERY_KEY = (
  eventId: string,
  passId?: string
): QueryKey => {
  const key = [...EVENT_QUERY_KEY(eventId), "SESSIONS"];
  if (passId) {
    key.push(passId);
  }
  return key;
};

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
  passId?: string;
}

export const GetEventSessions = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/sessions`, {
    params: {
      passId: passId || undefined,
    },
  });

  return data;
};

export const useGetEventSessions = (
  eventId: string = "",
  passId?: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventSessions>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessions>>(
    EVENT_SESSIONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventSessions({ eventId, passId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
