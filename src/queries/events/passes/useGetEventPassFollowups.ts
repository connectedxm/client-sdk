import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

export const EVENT_PASS_FOLLOWUPS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "FOLLOWUPS",
];

export const SET_EVENT_PASS_FOLLOWUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_PASS_FOLLOWUPS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetEventPassFollowups>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_FOLLOWUPS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassFollowupsProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventPassFollowups = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventPassFollowupsProps): Promise<
  ConnectedXMResponse<RegistrationFollowup[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/followups`,
    {}
  );

  return data;
};

export const useGetEventPassFollowups = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassFollowups>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventPassFollowups>
  >(
    EVENT_PASS_FOLLOWUPS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventPassFollowups({
        eventId,
        passId,
        ...params,
      }),
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      ...options,
      enabled:
        !!authenticated && !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
