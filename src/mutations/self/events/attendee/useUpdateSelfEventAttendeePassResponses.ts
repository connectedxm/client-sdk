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

export interface UpdateSelfEventAttendeePassResponsesParams
  extends MutationParams {
  eventId: string;
  passId: string;
  questions: {
    id: number;
    value: string;
  }[];
}

export const UpdateSelfEventAttendeePassResponses = async ({
  eventId,
  passId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateSelfEventAttendeePassResponsesParams): Promise<
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

export const useUpdateSelfEventAttendeePassResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventAttendeePassResponses>>,
      Omit<
        UpdateSelfEventAttendeePassResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventAttendeePassResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventAttendeePassResponses, options);
};
