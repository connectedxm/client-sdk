import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface CreateSelfEventRegistrationSessionPassesIntentParams
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

export const CreateSelfEventRegistrationSessionPassesIntent = async ({
  eventId,
  registrationId,
  sessionId,
  sessionPasses,
  clientApiParams,
}: CreateSelfEventRegistrationSessionPassesIntentParams): Promise<
  ConnectedXMResponse<PaymentIntent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<PaymentIntent>>(
    `/self/events/${eventId}/registration/${registrationId}/sessions/${sessionId}/intent`,
    sessionPasses
  );

  return data;
};

export const useCreateSelfEventRegistrationSessionPassesIntent = (
  options: Omit<
    MutationOptions<
      Awaited<
        ReturnType<typeof CreateSelfEventRegistrationSessionPassesIntent>
      >,
      Omit<
        CreateSelfEventRegistrationSessionPassesIntentParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfEventRegistrationSessionPassesIntentParams,
    Awaited<ReturnType<typeof CreateSelfEventRegistrationSessionPassesIntent>>
  >(CreateSelfEventRegistrationSessionPassesIntent, options);
};
