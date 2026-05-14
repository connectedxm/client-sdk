import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_PASS_QUERY_KEY } from "../useGetEventAttendeePass";

export const EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionId: string
): QueryKey => [
  ...EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
  "SESSIONS",
  sessionId,
  "ACCESS",
];

export const SET_EVENT_ATTENDEE_PASS_ACCESS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePassAccess>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePassAccessProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  sessionId: string;
}

export const GetEventAttendeePassAccess = async ({
  eventId,
  passId,
  sessionId,
  clientApiParams,
}: GetEventAttendeePassAccessProps): Promise<
  ConnectedXMResponse<EventSessionAccess>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}`
  );

  return data;
};

export const useGetEventAttendeePassAccess = (
  eventId: string,
  passId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassAccess>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassAccess>
  >(
    EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY(eventId, passId, sessionId),
    (params: SingleQueryParams) =>
      GetEventAttendeePassAccess({
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
