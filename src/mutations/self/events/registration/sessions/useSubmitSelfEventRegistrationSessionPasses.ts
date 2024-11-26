import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface SubmitSelfEventRegistrationSessionPassesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  sessionId: string;
  sessionPasses: {
    passId: string;
    responses: {
      questionId: string;
      value: string;
    }[];
  }[];
}

export const SubmitSelfEventRegistrationSessionPasses = async ({
  eventId,
  registrationId,
  sessionId,
  sessionPasses,
  clientApiParams,
}: SubmitSelfEventRegistrationSessionPassesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/${registrationId}/sessions/${sessionId}/submit`,
    sessionPasses
  );

  return data;
};

export const useSubmitSelfEventRegistrationSessionPasses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubmitSelfEventRegistrationSessionPasses>>,
      Omit<
        SubmitSelfEventRegistrationSessionPassesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubmitSelfEventRegistrationSessionPassesParams,
    Awaited<ReturnType<typeof SubmitSelfEventRegistrationSessionPasses>>
  >(SubmitSelfEventRegistrationSessionPasses, options);
};
