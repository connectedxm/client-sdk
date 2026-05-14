import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY } from "./useGetEventAttendeePassQuestionFollowups";

export const EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY = (
  eventId: string,
  passId: string,
  followupId: string
): QueryKey => [
  ...EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(eventId, passId),
  followupId,
];

export const SET_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventAttendeePassQuestionFollowup>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePassQuestionFollowupProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
  followupId: string;
}

export const GetEventAttendeePassQuestionFollowup = async ({
  eventId,
  passId,
  followupId,
  clientApiParams,
}: GetEventAttendeePassQuestionFollowupProps): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/followups/${followupId}`
  );

  return data;
};

export const useGetEventAttendeePassQuestionFollowup = (
  eventId: string,
  passId: string,
  followupId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassQuestionFollowup>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassQuestionFollowup>
  >(
    EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY(
      eventId,
      passId,
      followupId
    ),
    (params: SingleQueryParams) =>
      GetEventAttendeePassQuestionFollowup({
        eventId,
        passId,
        followupId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!passId &&
        !!followupId &&
        (options?.enabled ?? true),
    }
  );
};
