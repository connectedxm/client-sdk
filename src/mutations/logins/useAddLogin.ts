import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_LOGINS_QUERY_KEY, LOGIN_QUERY_KEY } from "@src/queries";

export interface AddLoginParams extends MutationParams {
  username: string;
}

export const AddLogin = async ({
  username,
  clientApiParams,
  queryClient,
}: AddLoginParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
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
