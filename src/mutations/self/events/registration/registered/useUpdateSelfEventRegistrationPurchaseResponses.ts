import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_EVENT_PAID_PURCHASES_QUERY_KEY,
  SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface UpdateSelfEventRegistrationPurchaseResponsesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questions: {
    id: number;
    value: string;
  }[];
}

export const UpdateSelfEventRegistrationPurchaseResponses = async ({
  eventId,
  registrationId,
  purchaseId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationPurchaseResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}`,
    {
      questions,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_PAID_PURCHASES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_PAID_PURCHASES_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useUpdateSelfEventRegistrationPurchaseResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationPurchaseResponses>>,
      Omit<
        UpdateSelfEventRegistrationPurchaseResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationPurchaseResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventRegistrationPurchaseResponses, options);
};
