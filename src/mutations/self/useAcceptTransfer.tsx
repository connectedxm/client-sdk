import { QUERY_KEY as TRANSFERS_KEY } from "@context/queries/self/useGetSelfTransfers";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM } from "src/context/api/ConnectedXM";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

export interface AcceptTransferParams extends MutationParams {
  transferId: string;
}

export const AcceptTransfer = async ({ transferId }: AcceptTransferParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/self/transfers/${transferId}`);
  return data;
};

export const useAcceptTransfer = () => {
  const queryClient = useQueryClient();
  return useConnectedMutation<AcceptTransferParams>(AcceptTransfer, {
    onSuccess: () => {
      queryClient.invalidateQueries([TRANSFERS_KEY]);
    },
  });
};

export default useAcceptTransfer;
