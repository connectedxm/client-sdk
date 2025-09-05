import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries/self/registration/sessions";

export interface UpdateSelfEventSessionRegistrationSearchListResponseParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
  questionId: string;
  searchListValueId: string;
}

export const UpdateSelfEventSessionRegistrationSearchListResponse = async ({
  eventId,
  sessionId,
  passId,
  questionId,
  searchListValueId,
  clientApiParams,
  queryClient,
}: UpdateSelfEventSessionRegistrationSearchListResponseParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/sessions/${sessionId}/registration/passes/${passId}/questions/${questionId}`,
    { response: searchListValueId }
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

export const useUpdateSelfEventSessionRegistrationSearchListResponse = (
  options: Omit<
    MutationOptions<
      Awaited<
        ReturnType<typeof UpdateSelfEventSessionRegistrationSearchListResponse>
      >,
      Omit<
        UpdateSelfEventSessionRegistrationSearchListResponseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventSessionRegistrationSearchListResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventSessionRegistrationSearchListResponse, options);
};
