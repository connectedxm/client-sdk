import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import {
  BaseRegistrationQuestionResponse,
  ConnectedXMResponse,
  RegistrationQuestionResponse,
} from "@interfaces";

interface UpdateSelfEventRegistrationGuestResponsesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  guestId: string;
  responses: BaseRegistrationQuestionResponse[];
}

export const UpdateSelfEventRegistrationGuestResponses = async ({
  eventId,
  registrationId,
  guestId,
  responses,
  clientApiParams,
}: UpdateSelfEventRegistrationGuestResponsesParams): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<
    ConnectedXMResponse<RegistrationQuestionResponse>
  >(
    `/self/events/${eventId}/registration/${registrationId}/draft/guests/${guestId}/responses`,
    responses
  );

  return data;
};

export const useUpdateSelfEventRegistrationGuestResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuestResponses>>,
      Omit<
        UpdateSelfEventRegistrationGuestResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationGuestResponsesParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuestResponses>>
  >(UpdateSelfEventRegistrationGuestResponses, options);
};
