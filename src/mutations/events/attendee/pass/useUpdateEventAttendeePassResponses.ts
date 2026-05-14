import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_ATTENDEE_PASS_QUERY_KEY,
  EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";

export interface UpdateEventAttendeePassResponsesParams extends MutationParams {
  eventId: string;
  passId: string;
  questions: {
    id: string;
    value: string;
  }[];
}

export const UpdateEventAttendeePassResponses = async ({
  eventId,
  passId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateEventAttendeePassResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/passes/${passId}/questions`,
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
  }

  return data;
};

export const useUpdateEventAttendeePassResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendeePassResponses>>,
      Omit<
        UpdateEventAttendeePassResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeePassResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventAttendeePassResponses, options);
};
