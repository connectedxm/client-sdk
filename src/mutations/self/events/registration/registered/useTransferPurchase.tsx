import { ConnectedXMResponse, Transfer } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";

export interface TransferPurchaseParams extends MutationParams {
  email: string;
  purchaseId: string;
  eventId: string;
  registrationId: string;
}

export const TransferPurchase = async ({
  email,
  purchaseId,
  eventId,
  registrationId,
  clientApi,
  queryClient,
}: TransferPurchaseParams): Promise<ConnectedXMResponse<Transfer>> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Transfer>>(
    `/self/events/${eventId}/registration/${registrationId}/transfer`,
    {
      email,
      purchaseId,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useTransferPurchase = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof TransferPurchase>>,
    TransferPurchaseParams
  > = {}
) => {
  return useConnectedMutation(TransferPurchase, params, options);
};
