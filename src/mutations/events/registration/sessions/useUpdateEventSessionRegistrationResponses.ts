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
export interface UpdateEventSessionRegistrationResponsesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  passes: {
    passId: string;
    responses: { questionId: string; value: string }[];
  }[];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionRegistrationResponses = async ({
  eventId,
  sessionId,
  passes,
  clientApiParams,
  queryClient,
}: UpdateEventSessionRegistrationResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/sessions/${sessionId}/registration/questions`,
    passes
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
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventSessionRegistrationResponses, options);
};
