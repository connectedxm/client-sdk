import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries/self/registration/sessions";

export interface UpdateSelfEventSessionRegistrationPassesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  accesses: {
    passId: string;
  }[];
}

export const UpdateSelfEventSessionRegistrationPasses = async ({
  eventId,
  sessionId,
  accesses,
  clientApiParams,
  queryClient,
}: UpdateSelfEventSessionRegistrationPassesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/sessions/${sessionId}/registration/passes`,
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

export const useUpdateSelfEventSessionRegistrationPasses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventSessionRegistrationPasses>>,
      Omit<
        UpdateSelfEventSessionRegistrationPassesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventSessionRegistrationPassesParams,
    Awaited<ReturnType<typeof UpdateSelfEventSessionRegistrationPasses>>
  >(UpdateSelfEventSessionRegistrationPasses, options);
};
