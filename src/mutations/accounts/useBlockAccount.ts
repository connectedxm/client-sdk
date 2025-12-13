import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACCOUNTS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Accounts
 */
export interface BlockAccountParams extends MutationParams {
  accountId: string;
}

/**
 * @category Methods
 * @group Accounts
 */
export const BlockAccount = async ({
  accountId,
  queryClient,
  clientApiParams,
}: BlockAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/block`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNTS_QUERY_KEY(),
    });

    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

/**
 * @category Mutations
 * @group Accounts
 */
export const useBlockAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof BlockAccount>>,
      Omit<BlockAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    BlockAccountParams,
    Awaited<ReturnType<typeof BlockAccount>>
  >(BlockAccount, options);
};
