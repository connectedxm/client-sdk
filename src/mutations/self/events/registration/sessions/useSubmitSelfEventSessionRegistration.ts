import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY } from "@src/queries/self/registration/sessions";

export interface SubmitSelfEventSessionRegistrationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const SubmitSelfEventSessionRegistration = async ({
  eventId,
  sessionId,
  clientApiParams,
  queryClient,
}: SubmitSelfEventSessionRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/sessions/${sessionId}/registration/submit`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
    });
  }

  return data;
};

export const useSubmitSelfEventSessionRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubmitSelfEventSessionRegistration>>,
      Omit<
        SubmitSelfEventSessionRegistrationParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubmitSelfEventSessionRegistrationParams,
    Awaited<ReturnType<typeof SubmitSelfEventSessionRegistration>>
  >(SubmitSelfEventSessionRegistration, options);
};
