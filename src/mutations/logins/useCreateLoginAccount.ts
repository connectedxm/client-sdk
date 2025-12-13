import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LOGIN_QUERY_KEY } from "@src/queries";
import { LoginAccountCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Logins
 */
export interface CreateLoginAccountParams extends MutationParams {
  account: LoginAccountCreateInputs;
}

/**
 * @category Methods
 * @group Logins
 */
export const CreateLoginAccount = async ({
  clientApiParams,
  queryClient,
  account,
}: CreateLoginAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/login/account`,
    account
  );

  if (queryClient) {
    queryClient.invalidateQueries({ queryKey: LOGIN_QUERY_KEY() });
  }

  return data;
};

/**
 * @category Mutations
 * @group Logins
 */
export const useCreateLoginAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateLoginAccount>>,
      Omit<CreateLoginAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateLoginAccountParams,
    Awaited<ReturnType<typeof CreateLoginAccount>>
  >(CreateLoginAccount, options);
};
