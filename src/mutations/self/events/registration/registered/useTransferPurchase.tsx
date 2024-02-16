import type { Transfer } from "@context/interfaces";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { QUERY_KEY as EVENT_REGISTRATION_KEY } from "@context/queries/self/registration/useGetSelfEventRegistration";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";

interface TransferPurchaseParams extends MutationParams {
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
}: TransferPurchaseParams): Promise<ConnectedXMResponse<Transfer>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/self/events/${eventId}/registration/${registrationId}/transfer`,
    {
      email,
      purchaseId,
    }
  );
  return data;
};

export const useTransferPurchase = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(
    (params: Omit<TransferPurchaseParams, "eventId" | "registrationId">) =>
      TransferPurchase({ ...params, eventId, registrationId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([EVENT_REGISTRATION_KEY, eventId]);
      },
    }
  );
};

export default useTransferPurchase;
