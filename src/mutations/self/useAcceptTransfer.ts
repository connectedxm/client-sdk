import { ConnectedXMResponse, Transfer } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_TRANSFERS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface AcceptTransferParams extends MutationParams {
  transferId: string;
}

export const AcceptTransfer = async ({
  transferId,
  clientApiParams,
  queryClient,
}: AcceptTransferParams): Promise<ConnectedXMResponse<Transfer>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Transfer>>(
    `/self/transfers/${transferId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_TRANSFERS_QUERY_KEY() });
  }

  return data;
};

export const useAcceptTransfer = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AcceptTransfer>>,
      Omit<AcceptTransferParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AcceptTransferParams,
    Awaited<ReturnType<typeof AcceptTransfer>>
  >(AcceptTransfer, options);
};
