import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_EVENT_ATTENDEE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface UpdateSelfEventAttendeeRegistrationResponsesParams
  extends MutationParams {
  eventId: string;
  passId: string;
  responses: { questionId: number; value: string }[];
}

export const UpdateSelfEventAttendeeRegistrationResponses = async ({
  eventId,
  passId,
  responses,
  clientApiParams,
  queryClient,
}: UpdateSelfEventAttendeeRegistrationResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/passes/${passId}/questions`,
    {
      responses,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY(
        eventId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useUpdateSelfEventAttendeeRegistrationResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventAttendeeRegistrationResponses>>,
      Omit<
        UpdateSelfEventAttendeeRegistrationResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventAttendeeRegistrationResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventAttendeeRegistrationResponses, options);
};
