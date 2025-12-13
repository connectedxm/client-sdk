import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY } from "@src/queries/events/attendee/useGetEventAttendeePassQuestionSections";
import {
  SELF_EVENT_ATTENDEE_PASS_QUERY_KEY,
  SELF_EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries/events/attendee";
import { SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY } from "@src/queries/events/attendee/useGetEventAttendeePassQuestionFollowups";
import { SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY } from "@src/queries/events/attendee/useGetEventAttendeePassQuestionFollowup";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventPassFollowupParams
  extends MutationParams {
  eventId: string;
  passId: string;
  followupId: string;
  questions: {
    id: string;
    value: string;
  }[];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventPassFollowup = async ({
  eventId,
  passId,
  followupId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateEventPassFollowupParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/passes/${passId}/followups/${followupId}`,
    {
      questions,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY(
        eventId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(
        eventId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY(
        eventId,
        passId,
        followupId
      ),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventPassFollowup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassFollowup>>,
      Omit<
        UpdateEventPassFollowupParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassFollowupParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventPassFollowup, options);
};
