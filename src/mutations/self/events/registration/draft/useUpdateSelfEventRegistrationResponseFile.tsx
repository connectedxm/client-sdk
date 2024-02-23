import {
  ConnectedXMResponse,
  RegistrationQuestionResponse,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";

export interface UpdateSelfEventRegistrationResponseFileParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  dataUrl: string;
  name: string;
  questionId: string;
}

export const UpdateSelfEventRegistrationResponseFile = async ({
  eventId,
  registrationId,
  dataUrl,
  name,
  questionId,
  clientApi,
}: UpdateSelfEventRegistrationResponseFileParams): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  const { data } = await clientApi.put<
    ConnectedXMResponse<RegistrationQuestionResponse>
  >(
    `/self/events/${eventId}/registration/${registrationId}/draft/responses/file`,
    {
      dataUrl,
      name,
      questionId,
    }
  );

  return data;
};

export const useUpdateSelfEventRegistrationResponseFile = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponseFile>>,
      Omit<
        UpdateSelfEventRegistrationResponseFileParams,
        "queryClient" | "clientApi"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationResponseFileParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponseFile>>
  >(UpdateSelfEventRegistrationResponseFile, params, options);
};
