import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY } from "../useGetEventAttendee";

export const EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "FOLLOWUPS",
];

export const SET_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventAttendeePassQuestionFollowups>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePassQuestionFollowupsProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventAttendeePassQuestionFollowups = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventAttendeePassQuestionFollowupsProps): Promise<
  ConnectedXMResponse<RegistrationFollowup[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/followups`,
    {}
  );

  return data;
};

export const useGetEventAttendeePassQuestionFollowups = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassQuestionFollowups>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassQuestionFollowups>
  >(
    EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventAttendeePassQuestionFollowups({
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
