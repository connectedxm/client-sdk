import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_ATTENDEE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface CancelPurchaseParams extends MutationParams {
  purchaseId: string;
  eventId: string;
  registrationId: string;
  issueRefund?: boolean;
}

export const CancelPurchase = async ({
  purchaseId,
  eventId,
  registrationId,
  issueRefund,
  clientApiParams,
  queryClient,
}: CancelPurchaseParams): Promise<ConnectedXMResponse<Purchase>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Purchase>>(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}/cancel`,
    {
      issueRefund,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useCancelPurchase = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelPurchase>>,
      Omit<CancelPurchaseParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelPurchaseParams,
    Awaited<ReturnType<typeof CancelPurchase>>
  >(CancelPurchase, options);
};
