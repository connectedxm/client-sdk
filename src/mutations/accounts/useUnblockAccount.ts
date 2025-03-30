import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACCOUNTS_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";

export interface UnblockAccountParams extends MutationParams {
  accountId: string;
}

export const UnblockAccount = async ({
  accountId,
  queryClient,
  clientApiParams,
}: UnblockAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/unblock`
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

export const useUnblockAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UnblockAccount>>,
      Omit<UnblockAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UnblockAccountParams,
    Awaited<ReturnType<typeof UnblockAccount>>
  >(UnblockAccount, options);
};
