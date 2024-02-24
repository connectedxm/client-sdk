import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Transfer } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";

export interface CancelTransferParams extends MutationParams {
  transferId: string;
  eventId: string;
  registrationId: string;
}

export const CancelTransfer = async ({
  transferId,
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
}: CancelTransferParams): Promise<ConnectedXMResponse<Transfer>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Transfer>>(
    `/self/events/${eventId}/registration/${registrationId}/transfer/${transferId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useCancelTransfer = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelTransfer>>,
      Omit<CancelTransferParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelTransferParams,
    Awaited<ReturnType<typeof CancelTransfer>>
  >(CancelTransfer, params, options);
};
