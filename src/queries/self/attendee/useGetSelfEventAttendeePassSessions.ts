import { ConnectedXMResponse, Session } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_PASS_SESSIONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "AVAILABLE_ADD_ONS",
];

export const SET_SELF_EVENT_ATTENDEE_PASS_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_ATTENDEE_PASS_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventAttendeePassSessions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_PASS_SESSIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeePassSessionsProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetSelfEventAttendeePassSessions = async ({
  eventId,
  passId,
  clientApiParams,
}: GetSelfEventAttendeePassSessionsProps): Promise<
  ConnectedXMResponse<Session[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions`,
    {}
  );

  return data;
};

export const useGetSelfEventAttendeePassSessions = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeePassSessions>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeePassSessions>
  >(
    SELF_EVENT_ATTENDEE_PASS_SESSIONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePassSessions({
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
