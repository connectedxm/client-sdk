import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LOGIN_QUERY_KEY } from "@src/queries";
import { SELF_LOGINS_QUERY_KEY } from "@src/queries/self";

/**
 * @category Params
 * @group Logins
 */
export interface RemoveLoginParams extends MutationParams {
  username: string;
}

/**
 * @category Methods
 * @group Logins
 */
export const RemoveLogin = async ({
  username,
  clientApiParams,
  queryClient,
}: RemoveLoginParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/login/account/${username}`
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
export const useRemoveLogin = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveLogin>>,
      Omit<RemoveLoginParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveLoginParams,
    Awaited<ReturnType<typeof RemoveLogin>>
  >(RemoveLogin, options);
};
