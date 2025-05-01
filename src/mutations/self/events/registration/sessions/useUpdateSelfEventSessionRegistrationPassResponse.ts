import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries/self/registration/sessions";

export interface UpdateSelfEventSessionRegistrationPassResponseParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
  questionId: string;
  response: string;
}

export const UpdateSelfEventSessionRegistrationPassResponse = async ({
  eventId,
  sessionId,
  passId,
  questionId,
  response,
  clientApiParams,
  queryClient,
}: UpdateSelfEventSessionRegistrationPassResponseParams): Promise<
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

export const useUpdateSelfEventSessionRegistrationPassResponse = (
  options: Omit<
    MutationOptions<
      Awaited<
        ReturnType<typeof UpdateSelfEventSessionRegistrationPassResponse>
      >,
      Omit<
        UpdateSelfEventSessionRegistrationPassResponseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventSessionRegistrationPassResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventSessionRegistrationPassResponse, options);
};
