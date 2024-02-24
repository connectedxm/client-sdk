import {
  ConnectedXMResponse,
  RegistrationQuestionResponse,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

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
  clientApiParams,
}: UpdateSelfEventRegistrationResponseFileParams): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponseFile>>,
      Omit<
        UpdateSelfEventRegistrationResponseFileParams,
        "queryClient" | "clientApiParams"
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
