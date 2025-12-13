import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries/events/registration/sessions";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionRegistrationPassesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  passes: {
    passId: string;
  }[];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionRegistrationPasses = async ({
  eventId,
  sessionId,
  passes,
  clientApiParams,
  queryClient,
}: UpdateEventSessionRegistrationPassesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/sessions/${sessionId}/registration/passes`,
    passes
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY(
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
export const useUpdateEventSessionRegistrationPasses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionRegistrationPasses>>,
      Omit<
        UpdateEventSessionRegistrationPassesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionRegistrationPassesParams,
    Awaited<ReturnType<typeof UpdateEventSessionRegistrationPasses>>
  >(UpdateEventSessionRegistrationPasses, options);
};
