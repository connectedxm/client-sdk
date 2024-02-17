import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Account } from "@context/interfaces";
import { QUERY_KEY as SELF_DELEGATES } from "@context/queries/self/useGetSelfDelegates";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

export interface AddSelfDelegateParams extends MutationParams {
  email: string;
}

export const AddSelfDelegate = async ({ email }: AddSelfDelegateParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/self/delegates`, {
    email,
  });
  return data;
};

export const useAddSelfDelegate = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (email: string) => AddSelfDelegate({ email }),
    {
      onSuccess: (_response: ConnectedXMResponse<Account>) => {
        queryClient.invalidateQueries([SELF_DELEGATES]);
      },
    }
  );
};

export default useAddSelfDelegate;
