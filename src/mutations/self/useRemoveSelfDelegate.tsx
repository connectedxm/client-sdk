import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Account } from "@context/interfaces";
import { QUERY_KEY as SELF_DELEGATES } from "@context/queries/self/useGetSelfDelegates";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

export interface RemoveSelfDelegateParams extends MutationParams {
  accountId: string;
}

export const RemoveSelfDelegate = async ({
  accountId,
}: RemoveSelfDelegateParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/self/delegates/${accountId}`);
  return data;
};

export const useRemoveSelfDelegate = (accountId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(() => RemoveSelfDelegate({ accountId }), {
    onSuccess: (_response: ConnectedXMResponse<Account>) => {
      queryClient.invalidateQueries([SELF_DELEGATES]);
    },
  });
};

export default useRemoveSelfDelegate;
