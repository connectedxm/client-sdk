import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Account } from "@context/interfaces";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface CreateTeamAccountParams extends MutationParams {
  name: string;
  email: string;
}

export const CreateTeamAccount = async (params: CreateTeamAccountParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/self/team`, params);
  return data;
};

export const useCreateTeamAccount = () => {
  return useConnectedMutation<CreateTeamAccountParams>(CreateTeamAccount, {
    onSuccess: async (response: ConnectedXMResponse<Account>) => {
      if (response.data) {
        // window.localStorage.setItem(DELEGATION_KEY, response.data.id);
        // await router.replace("/account");
        // queryClient.clear();
        // queryClient.setQueryData([SELF], response);
      }
    },
  });
};

export default useCreateTeamAccount;
