import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { ConnectedXMResponse, RegistrationQuestionResponse } from "@interfaces";

export interface UpdateSelfEventRegistrationGuestResponseFileParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  questionId: string;
  guestId?: string;
  dataUrl: string;
  name: string;
}

export const UpdateSelfEventRegistrationGuestResponseFile = async ({
  eventId,
  registrationId,
  questionId,
  guestId,
  dataUrl,
  name,
  clientApi,
}: UpdateSelfEventRegistrationGuestResponseFileParams): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  if (!guestId) throw new Error("Guest ID is required");

  const { data } = await clientApi.put<
    ConnectedXMResponse<RegistrationQuestionResponse>
  >(
    `/self/events/${eventId}/registration/${registrationId}/draft/guests/${guestId}/responses/file`,
    {
      dataUrl,
      name,
      questionId,
    }
  );

  return data;
};

export const useUpdateSelfEventRegistrationGuestResponseFile = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuestResponseFile>>,
      Omit<
        UpdateSelfEventRegistrationGuestResponseFileParams,
        "queryClient" | "clientApi"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationGuestResponseFileParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuestResponseFile>>
  >(UpdateSelfEventRegistrationGuestResponseFile, params, options);
};
