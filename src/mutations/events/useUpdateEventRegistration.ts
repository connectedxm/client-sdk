import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, RegistrationDraft } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface UpdateEventRegistrationParams extends MutationParams {
  eventId: string;
  draft: RegistrationDraft;
}

export const UpdateEventRegistration = async ({
  eventId,
  draft,
  clientApiParams,
}: UpdateEventRegistrationParams): Promise<
  ConnectedXMResponse<RegistrationDraft>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.put<ConnectedXMResponse<RegistrationDraft>>(
    `/events/${eventId}/registration`,
    draft
  );

  return data;
};

export const useUpdateEventRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventRegistration>>,
      Omit<UpdateEventRegistrationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRegistrationParams,
    Awaited<ReturnType<typeof UpdateEventRegistration>>
  >(UpdateEventRegistration, options);
};
