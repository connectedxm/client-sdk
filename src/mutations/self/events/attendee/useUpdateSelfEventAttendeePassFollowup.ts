import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY } from "@src/queries/self/attendee/useGetSelfEventAttendeePassQuestionSections";
import {
  SELF_EVENT_ATTENDEE_PASS_QUERY_KEY,
  SELF_EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries/self/attendee";
import { SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY } from "@src/queries/self/attendee/useGetSelfEventAttendeePassQuestionFollowups";
import { SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY } from "@src/queries/self/attendee/useGetSelfEventAttendeePassQuestionFollowup";

export interface UpdateSelfEventAttendeePassFollowupParams
  extends MutationParams {
  eventId: string;
  passId: string;
  followupId: string;
  questions: {
    id: string;
    value: string;
  }[];
}

export const UpdateSelfEventAttendeePassFollowup = async ({
  eventId,
  passId,
  followupId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateSelfEventAttendeePassFollowupParams): Promise<
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

export const useUpdateSelfEventAttendeePassFollowup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventAttendeePassFollowup>>,
      Omit<
        UpdateSelfEventAttendeePassFollowupParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventAttendeePassFollowupParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventAttendeePassFollowup, options);
};
