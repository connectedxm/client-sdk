import { QUERY_KEY as TRANSFERS_KEY } from "@context/queries/self/useGetSelfTransfers";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM } from "src/context/api/ConnectedXM";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface RejectTransferParams extends MutationParams {
  transferId: string;
}

export const RejectTransfer = async ({ transferId }: RejectTransferParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/self/transfers/${transferId}`);
  return data;
};

export const useRejectTransfer = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RejectTransferParams>(RejectTransfer, {
    onSuccess: () => {
      queryClient.invalidateQueries([TRANSFERS_KEY]);
    },
  });
};

export default useRejectTransfer;
