import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries/events/registration/sessions";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionRegistrationResponseParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
  questionId: string;
  response: string;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionRegistrationResponse = async ({
  eventId,
  sessionId,
  passId,
  questionId,
  response,
  clientApiParams,
  queryClient,
}: UpdateEventSessionRegistrationResponseParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/sessions/${sessionId}/registration/passes/${passId}/questions/${questionId}`,
    { response }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY(
        eventId,
        sessionId
      ),
      exact: false,
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionRegistrationResponse = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionRegistrationResponse>>,
      Omit<
        UpdateEventSessionRegistrationResponseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionRegistrationResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventSessionRegistrationResponse, options);
};
