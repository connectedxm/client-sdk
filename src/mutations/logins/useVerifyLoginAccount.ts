import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LOGIN_QUERY_KEY } from "@src/queries";

export interface VerifyLoginAccountParams extends MutationParams {}

export const VerifyLoginAccount = async ({
  clientApiParams,
  queryClient,
}: VerifyLoginAccountParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/login/account/verify`
  );

  if (queryClient) {
    queryClient.invalidateQueries({ queryKey: LOGIN_QUERY_KEY() });
  }

  return data;
};

export const useVerifyLoginAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof VerifyLoginAccount>>,
      Omit<VerifyLoginAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    VerifyLoginAccountParams,
    Awaited<ReturnType<typeof VerifyLoginAccount>>
  >(VerifyLoginAccount, options);
};
