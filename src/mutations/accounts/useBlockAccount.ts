import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { BlockedAccount, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface BlockAccountParams extends MutationParams {
  accountId: string;
}

export const BlockAccount = async ({
  accountId,
  clientApiParams,
}: BlockAccountParams): Promise<ConnectedXMResponse<BlockedAccount>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<BlockedAccount>>(
    `/accounts/${accountId}/block`
  );

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
