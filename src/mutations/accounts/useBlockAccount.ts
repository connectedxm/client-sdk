import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACCOUNT_QUERY_KEY, ACCOUNTS_QUERY_KEY } from "@src/queries";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

export interface BlockAccountParams extends MutationParams {
  accountId: string;
}

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

    SetSingleQueryData(
      queryClient,
      ACCOUNT_QUERY_KEY(accountId),
      clientApiParams.locale,
      data.data
    );
  }

  return data;
};

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
