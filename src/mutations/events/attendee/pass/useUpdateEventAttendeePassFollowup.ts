import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_ATTENDEE_PASS_QUERY_KEY,
  EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY,
  EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY,
  EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";

export interface UpdateEventAttendeePassFollowupParams extends MutationParams {
  eventId: string;
  passId: string;
  followupId: string;
  questions: {
    id: string;
    value: string;
  }[];
}

export const UpdateEventAttendeePassFollowup = async ({
  eventId,
  passId,
  followupId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateEventAttendeePassFollowupParams): Promise<
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
      queryKey: EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY(
        eventId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(
        eventId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUP_QUERY_KEY(
        eventId,
        passId,
        followupId
      ),
    });
  }

  return data;
};

export const useUpdateEventAttendeePassFollowup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendeePassFollowup>>,
      Omit<
        UpdateEventAttendeePassFollowupParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeePassFollowupParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventAttendeePassFollowup, options);
};
