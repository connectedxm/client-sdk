import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_PASS_QUERY_KEY } from "../useGetSelfEventAttendeePass";

export const SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
  "SESSIONS",
  sessionId,
  "ACCESS",
];

export const SET_SELF_EVENT_ATTENDEE_ACCESS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventAttendeeAccess>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeeAccessProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  sessionId: string;
}

export const GetSelfEventAttendeeAccess = async ({
  eventId,
  passId,
  sessionId,
  clientApiParams,
}: GetSelfEventAttendeeAccessProps): Promise<
  ConnectedXMResponse<EventSessionAccess>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}`
  );

  return data;
};

export const useGetSelfEventAttendeeAccess = (
  eventId: string,
  passId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeeAccess>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventAttendeeAccess>>(
    SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY(eventId, passId, sessionId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeeAccess({
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
