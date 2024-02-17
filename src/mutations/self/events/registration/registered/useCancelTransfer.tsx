import type { Transfer } from "@context/interfaces";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { QUERY_KEY as EVENT_REGISTRATION_KEY } from "@context/queries/self/registration/useGetSelfEventRegistration";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";

export interface CancelTransferParams extends MutationParams {
  transferId: string;
  eventId: string;
  registrationId: string;
}

export const CancelTransfer = async ({
  transferId,
  eventId,
  registrationId,
}: CancelTransferParams): Promise<ConnectedXMResponse<Transfer>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/self/events/${eventId}/registration/${registrationId}/transfer/${transferId}`
  );
  return data;
};

export const useCancelTransfer = (eventId: string, registrationId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(
    (params: Omit<CancelTransferParams, "eventId" | "registrationId">) =>
      CancelTransfer({ ...params, eventId, registrationId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([EVENT_REGISTRATION_KEY, eventId]);
      },
    }
  );
};

export default useCancelTransfer;
