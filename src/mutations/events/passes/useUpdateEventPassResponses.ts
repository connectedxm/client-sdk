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

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventPassResponsesParams
  extends MutationParams {
  eventId: string;
  passId: string;
  questions: {
    id: string;
    value: string;
  }[];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventPassResponses = async ({
  eventId,
  passId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateEventPassResponsesParams): Promise<
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
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventPassResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventPassResponses>>,
      Omit<
        UpdateEventPassResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventPassResponses, options);
};
