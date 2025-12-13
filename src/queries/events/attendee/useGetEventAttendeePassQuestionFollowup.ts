import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY } from "./useGetSelfEventAttendeePassQuestionFollowups";

export const SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY = (
  eventId: string,
  passId: string,
  followupId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(eventId, passId),
  followupId,
];

export const SET_SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventAttendeePassQuestionFollowup>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeePassQuestionFollowupProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
  followupId: string;
}

export const GetSelfEventAttendeePassQuestionFollowup = async ({
  eventId,
  passId,
  followupId,
  clientApiParams,
}: GetSelfEventAttendeePassQuestionFollowupProps): Promise<
  ConnectedXMResponse<RegistrationFollowup>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/followups/${followupId}`
  );

  return data;
};

export const useGetSelfEventAttendeePassQuestionFollowup = (
  eventId: string,
  passId: string,
  followupId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeePassQuestionFollowup>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeePassQuestionFollowup>
  >(
    SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY(
      eventId,
      passId,
      followupId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePassQuestionFollowup({
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
