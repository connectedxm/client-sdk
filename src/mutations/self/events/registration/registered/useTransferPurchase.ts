import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Transfer } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface TransferPurchaseParams extends MutationParams {
  passId: string;
  purchaseId: string;
  eventId: string;
  registrationId: string;
}

export const TransferPurchase = async ({
  passId,
  purchaseId,
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
}: TransferPurchaseParams): Promise<ConnectedXMResponse<Transfer>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Transfer>>(
    `/self/events/${eventId}/registration/${registrationId}/passes/${passId}/transfer`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useTransferPurchase = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof TransferPurchase>>,
      Omit<TransferPurchaseParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    TransferPurchaseParams,
    Awaited<ReturnType<typeof TransferPurchase>>
  >(TransferPurchase, options);
};
