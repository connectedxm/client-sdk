import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface SubmitSelfEventRegistrationSessionsParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const SubmitSelfEventRegistrationSessions = async ({
  eventId,
  registrationId,
  clientApiParams,
}: SubmitSelfEventRegistrationSessionsParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/${registrationId}/sessions/submit`
  );

  return data;
};

export const useSubmitSelfEventRegistrationSessions = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubmitSelfEventRegistrationSessions>>,
      Omit<
        SubmitSelfEventRegistrationSessionsParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubmitSelfEventRegistrationSessionsParams,
    Awaited<ReturnType<typeof SubmitSelfEventRegistrationSessions>>
  >(SubmitSelfEventRegistrationSessions, options);
};
