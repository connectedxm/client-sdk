import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_DELEGATES_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface RemoveSelfDelegateParams extends MutationParams {
  accountId: string;
}

export const RemoveSelfDelegate = async ({
  accountId,
  clientApiParams,
  queryClient,
}: RemoveSelfDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Account>>(
    `/self/delegates/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_DELEGATES_QUERY_KEY() });
  }

  return data;
};

export const useRemoveSelfDelegate = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfDelegate>>,
      Omit<RemoveSelfDelegateParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfDelegateParams,
    Awaited<ReturnType<typeof RemoveSelfDelegate>>
  >(RemoveSelfDelegate, options);
};
