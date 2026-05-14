import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY,
  EVENT_ATTENDEE_PASS_ACCESS_QUESTION_SECTIONS_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
  EVENT_ATTENDEE_PASS_QUERY_KEY,
} from "@src/queries";

export interface UpdateEventAttendeePassAccessResponsesParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
  responses: {
    questionId: string;
    value: string;
  }[];
}

export const UpdateEventAttendeePassAccessResponses = async ({
  eventId,
  passId,
  sessionId,
  responses,
  clientApiParams,
  queryClient,
}: UpdateEventAttendeePassAccessResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/questions`,
    responses
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_ACCESS_QUESTION_SECTIONS_QUERY_KEY(
        eventId,
        passId,
        sessionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY(
        eventId,
        passId,
        sessionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

export const useUpdateEventAttendeePassAccessResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendeePassAccessResponses>>,
      Omit<
        UpdateEventAttendeePassAccessResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeePassAccessResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventAttendeePassAccessResponses, options);
};
