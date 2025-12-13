import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_PASS_QUERY_KEY } from "../useGetEventPass";

export const EVENT_PASS_ACCESS_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionId: string
): QueryKey => [
  ...EVENT_PASS_QUERY_KEY(eventId, passId),
  "SESSIONS",
  sessionId,
  "ACCESS",
];

export const SET_EVENT_PASS_ACCESS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_ACCESS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassAccess>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_ACCESS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassAccessProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  sessionId: string;
}

export const GetEventPassAccess = async ({
  eventId,
  passId,
  sessionId,
  clientApiParams,
}: GetEventPassAccessProps): Promise<
  ConnectedXMResponse<EventSessionAccess>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}`
  );

  return data;
};

export const useGetEventPassAccess = (
  eventId: string,
  passId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassAccess>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventPassAccess>>(
    EVENT_PASS_ACCESS_QUERY_KEY(eventId, passId, sessionId),
    (params: SingleQueryParams) =>
      GetEventPassAccess({
        eventId,
        passId,
        sessionId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!passId &&
        !!sessionId &&
        (options?.enabled ?? true),
    }
  );
};
