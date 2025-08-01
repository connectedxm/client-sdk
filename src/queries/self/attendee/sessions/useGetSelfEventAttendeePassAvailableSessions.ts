import { ConnectedXMResponse, Session } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "../useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_PASS_AVAILABLE_SESSIONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "AVAILABLE_SESSIONS",
];

export const SET_SELF_EVENT_ATTENDEE_PASS_AVAILABLE_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_ATTENDEE_PASS_AVAILABLE_SESSIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventAttendeePassAvailableSessions>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_PASS_AVAILABLE_SESSIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeePassAvailableSessionsProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetSelfEventAttendeePassAvailableSessions = async ({
  eventId,
  passId,
  clientApiParams,
}: GetSelfEventAttendeePassAvailableSessionsProps): Promise<
  ConnectedXMResponse<Session[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/available/sessions`,
    {}
  );

  return data;
};

export const useGetSelfEventAttendeePassAvailableSessions = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeePassAvailableSessions>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeePassAvailableSessions>
  >(
    SELF_EVENT_ATTENDEE_PASS_AVAILABLE_SESSIONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePassAvailableSessions({
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
