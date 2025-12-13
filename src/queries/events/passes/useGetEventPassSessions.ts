import { ConnectedXMResponse, Session } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

export const EVENT_PASS_SESSIONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [...EVENT_PASS_QUERY_KEY(eventId, passId), "SESSIONS"];

export const SET_EVENT_PASS_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassSessions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_SESSIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassSessionsProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventPassSessions = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventPassSessionsProps): Promise<ConnectedXMResponse<Session[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/available/sessions`,
    {}
  );

  return data;
};

export const useGetEventPassSessions = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventPassSessions>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventPassSessions>>(
    EVENT_PASS_SESSIONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventPassSessions({
        eventId,
        passId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated && !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
