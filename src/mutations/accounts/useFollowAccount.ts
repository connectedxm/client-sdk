import { ConnectedXM } from "@context/api/ConnectedXM";
import { Account, BaseAccount } from "@context/interfaces";
import { QUERY_KEY as ACCOUNT } from "@context/queries/accounts/useGetAccount";
import { QUERY_KEY as ACCOUNT_FOLLOWINGS } from "@context/queries/accounts/useGetAccountFollowings";
import { QUERY_KEY as ACCOUNTS } from "@context/queries/accounts/useGetAccounts";
import { QUERY_KEY as SELF } from "@context/queries/self/useGetSelf";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface FollowAccountParams extends MutationParams {
  accountId: string;
}

export const FollowAccount = async ({ accountId }: FollowAccountParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/accounts/${accountId}/follow`);
  return data;
};

export const useFollowAccount = (account?: Account | BaseAccount) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<MutationParams>(
    (params) => FollowAccount({ ...params, accountId: account?.id || "" }),
    {
      onSuccess: (response) => {
        queryClient.setQueryData([ACCOUNT, account?.id], response);
        queryClient.setQueryData([ACCOUNT, account?.username], response);

        queryClient.invalidateQueries([ACCOUNTS, account?.id]);
        queryClient.invalidateQueries([ACCOUNTS, account?.username]);
        queryClient.invalidateQueries([ACCOUNT_FOLLOWINGS, account?.id]);
        queryClient.invalidateQueries([ACCOUNT_FOLLOWINGS, account?.username]);
        queryClient.invalidateQueries([SELF]);
      },
    },
    undefined,
    true
  );
};

export default useFollowAccount;
