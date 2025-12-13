import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries/events/registration/sessions";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionRegistrationSearchListResponseParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
  questionId: string;
  searchListValueId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionRegistrationSearchListResponse = async ({
  eventId,
  sessionId,
  passId,
  questionId,
  searchListValueId,
  clientApiParams,
  queryClient,
}: UpdateEventSessionRegistrationSearchListResponseParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/sessions/${sessionId}/registration/passes/${passId}/questions/${questionId}`,
    { response: searchListValueId }
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
export const useUpdateEventSessionRegistrationSearchListResponse = (
  options: Omit<
    MutationOptions<
      Awaited<
        ReturnType<typeof UpdateEventSessionRegistrationSearchListResponse>
      >,
      Omit<
        UpdateEventSessionRegistrationSearchListResponseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionRegistrationSearchListResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventSessionRegistrationSearchListResponse, options);
};
