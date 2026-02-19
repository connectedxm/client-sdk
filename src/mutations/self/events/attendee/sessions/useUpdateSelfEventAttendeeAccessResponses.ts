import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY,
  SELF_EVENT_ATTENDEE_ACCESS_QUESTION_SECTIONS_QUERY_KEY,
  SELF_EVENT_ATTENDEE_QUERY_KEY,
  SELF_EVENT_ATTENDEE_PASS_QUERY_KEY,
} from "@src/queries";

export interface UpdateSelfEventAttendeeAccessResponsesParams
  extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
  responses: {
    questionId: string;
    value: string;
  }[];
}

export const UpdateSelfEventAttendeeAccessResponses = async ({
  eventId,
  passId,
  sessionId,
  responses,
  clientApiParams,
  queryClient,
}: UpdateSelfEventAttendeeAccessResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/questions`,
    responses
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_ACCESS_QUESTION_SECTIONS_QUERY_KEY(
        eventId,
        passId,
        sessionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY(
        eventId,
        passId,
        sessionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

export const useUpdateSelfEventAttendeeAccessResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventAttendeeAccessResponses>>,
      Omit<
        UpdateSelfEventAttendeeAccessResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventAttendeeAccessResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventAttendeeAccessResponses, options);
};
