import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_ATTENDEE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface TransferPurchaseParams extends MutationParams {
  passId: string;
  eventId: string;
  registrationId: string;
  receiverId: string;
}

export const TransferPurchase = async ({
  passId,
  eventId,
  registrationId,
  receiverId,
  clientApiParams,
  queryClient,
}: TransferPurchaseParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/${registrationId}/passes/${passId}/transfer`,
    {
      receiverId,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
        eventId,
        registrationId,
        passId
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
