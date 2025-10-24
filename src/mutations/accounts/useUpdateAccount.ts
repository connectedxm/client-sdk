import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACCOUNT_QUERY_KEY, SET_ACCOUNT_QUERY_DATA } from "@src/queries";

export interface UpdateAccountParams extends MutationParams {
  accountId: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  website?: string | null;
  timezone?: string | null;
  attributes?: Record<string, string>;
}

export const UpdateAccount = async ({
  accountId,
  clientApiParams,
  queryClient,
  ...attributes
}: UpdateAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}`,
    attributes
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_QUERY_KEY(accountId),
    });

    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useUpdateAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateAccount>>,
      Omit<UpdateAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAccountParams,
    Awaited<ReturnType<typeof UpdateAccount>>
  >(UpdateAccount, options);
};
