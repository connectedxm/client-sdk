import { ConnectedXMResponse, Transfer } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_TRANSFERS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface RejectTransferParams extends MutationParams {
  transferId: string;
}

export const RejectTransfer = async ({
  transferId,
  clientApiParams,
  queryClient,
}: RejectTransferParams): Promise<ConnectedXMResponse<Transfer>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Transfer>>(
    `/self/transfers/${transferId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_TRANSFERS_QUERY_KEY(),
    });
  }

  return data;
};

export const useRejectTransfer = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RejectTransfer>>,
      Omit<RejectTransferParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RejectTransferParams,
    Awaited<ReturnType<typeof RejectTransfer>>
  >(RejectTransfer, options);
};
