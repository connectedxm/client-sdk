import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface UnblockAccountParams extends MutationParams {
  accountId: string;
}

export const UnblockAccount = async ({
  accountId,
  clientApiParams,
}: UnblockAccountParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/accounts/${accountId}/unblock`
  );

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
