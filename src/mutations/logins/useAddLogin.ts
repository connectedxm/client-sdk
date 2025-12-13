import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_LOGINS_QUERY_KEY, LOGIN_QUERY_KEY } from "@src/queries";
import { AddLoginInputs } from "@src/params";

/**
 * @category Params
 * @group Logins
 */
export interface AddLoginParams extends MutationParams {
  login: AddLoginInputs;
}

/**
 * @category Methods
 * @group Logins
 */
export const AddLogin = async ({
  login,
  clientApiParams,
  queryClient,
}: AddLoginParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/login/account/${login.username}`
  );

  if (queryClient) {
    queryClient.invalidateQueries({ queryKey: LOGIN_QUERY_KEY() });
    queryClient.invalidateQueries({
      queryKey: SELF_LOGINS_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Logins
 */
export const useAddLogin = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddLogin>>,
      Omit<AddLoginParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddLoginParams,
    Awaited<ReturnType<typeof AddLogin>>
  >(AddLogin, options);
};
