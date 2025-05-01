import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries/self/registration/sessions";

export interface UpdateSelfEventSessionRegistrationResponsesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  accesses: {
    passId: string;
    responses: { questionId: string; value: string }[];
  }[];
}

export const UpdateSelfEventSessionRegistrationResponses = async ({
  eventId,
  sessionId,
  accesses,
  clientApiParams,
  queryClient,
}: UpdateSelfEventSessionRegistrationResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/sessions/${sessionId}/registration/questions`,
    accesses
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

export const useUpdateSelfEventSessionRegistrationResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventSessionRegistrationResponses>>,
      Omit<
        UpdateSelfEventSessionRegistrationResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventSessionRegistrationResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventSessionRegistrationResponses, options);
};
