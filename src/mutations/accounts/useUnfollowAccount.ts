import { ConnectedXM } from "@context/api/ConnectedXM";
import { Account, BaseAccount } from "@context/interfaces";
import { QUERY_KEY as ACCOUNT } from "@context/queries/accounts/useGetAccount";
import { QUERY_KEY as ACCOUNT_FOLLOWERS } from "@context/queries/accounts/useGetAccountFollowers";
import { QUERY_KEY as ACCOUNTS } from "@context/queries/accounts/useGetAccounts";
import { QUERY_KEY as SELF } from "@context/queries/self/useGetSelf";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface UnfollowAccountParams extends MutationParams {
  accountId: string;
}

export const UnfollowAccount = async ({ accountId }: UnfollowAccountParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/accounts/${accountId}/unfollow`);
  return data;
};

export const useUnfollowAccount = (account?: Account | BaseAccount) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<MutationParams>(
    (params) => UnfollowAccount({ ...params, accountId: account?.id || "" }),
    {
      onSuccess: (response) => {
        queryClient.setQueryData([ACCOUNT, account?.id], response);
        queryClient.setQueryData([ACCOUNT, account?.username], response);

        queryClient.invalidateQueries([ACCOUNTS, account?.id]);
        queryClient.invalidateQueries([ACCOUNTS, account?.username]);
        queryClient.invalidateQueries([ACCOUNT_FOLLOWERS, account?.id]);
        queryClient.invalidateQueries([ACCOUNT_FOLLOWERS, account?.username]);
        queryClient.invalidateQueries([SELF]);
      },
    },
    undefined,
    true
  );
};

export default useUnfollowAccount;
