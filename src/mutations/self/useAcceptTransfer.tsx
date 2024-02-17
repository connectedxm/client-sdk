import { ConnectedXMResponse, Transfer } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_TRANSFERS_QUERY_KEY } from "@src/queries";

export interface AcceptTransferParams extends MutationParams {
  transferId: string;
}

export const AcceptTransfer = async ({
  transferId,
  clientApi,
  queryClient,
}: AcceptTransferParams): Promise<ConnectedXMResponse<Transfer>> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Transfer>>(
    `/self/transfers/${transferId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_TRANSFERS_QUERY_KEY() });
  }

  return data;
};

export const useAcceptTransfer = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof AcceptTransfer>>,
    AcceptTransferParams
  >
) => {
  return useConnectedMutation<
    AcceptTransferParams,
    Awaited<ReturnType<typeof AcceptTransfer>>
  >(AcceptTransfer, params, options);
};
