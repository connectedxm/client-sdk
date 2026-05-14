import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_ATTENDEE_PASS_SESSION_PASS_INTENT_QUERY_KEY } from "@src/queries";

export interface UpdateEventSessionRegistrationResponsesParams extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
  responses: { questionId: string; value: string }[];
}

export const UpdateEventSessionRegistrationResponses = async ({
  eventId,
  sessionId,
  passId,
  responses,
  clientApiParams,
  queryClient,
}: UpdateEventSessionRegistrationResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}/responses`,
    { responses }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_ATTENDEE_PASS_SESSION_PASS_INTENT_QUERY_KEY(
        eventId,
        sessionId,
        passId
      ),
      exact: false,
    });
  }

  return data;
};

export const useUpdateEventSessionRegistrationResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionRegistrationResponses>>,
      Omit<
        UpdateEventSessionRegistrationResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionRegistrationResponsesParams,
    Awaited<ReturnType<typeof UpdateEventSessionRegistrationResponses>>
  >(UpdateEventSessionRegistrationResponses, options);
};
