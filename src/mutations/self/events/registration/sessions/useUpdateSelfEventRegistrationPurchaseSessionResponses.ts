import { ConnectedXMResponse } from "../../../../../interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "../../../../../ClientAPI";

export interface UpdateSelfEventRegistrationPurchaseSessionResponsesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  sessionPassId: string;
  responses: {
    questionId: string;
    value: string | undefined;
  }[];
}

export const UpdateSelfEventRegistrationPurchaseSessionResponses = async ({
  eventId,
  registrationId,
  purchaseId,
  sessionPassId,
  responses,
  clientApiParams,
}: UpdateSelfEventRegistrationPurchaseSessionResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}/sessions/${sessionPassId}`,
    responses
  );

  return data;
};

export const useUpdateSelfEventRegistrationPurchaseSessionResponses = (
  options: Omit<
    MutationOptions<
      Awaited<
        ReturnType<typeof UpdateSelfEventRegistrationPurchaseSessionResponses>
      >,
      Omit<
        UpdateSelfEventRegistrationPurchaseSessionResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationPurchaseSessionResponsesParams,
    Awaited<
      ReturnType<typeof UpdateSelfEventRegistrationPurchaseSessionResponses>
    >
  >(UpdateSelfEventRegistrationPurchaseSessionResponses, options);
};
