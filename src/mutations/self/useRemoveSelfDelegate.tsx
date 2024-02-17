import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_DELEGATES_QUERY_KEY } from "@src/queries";

export interface RemoveSelfDelegateParams extends MutationParams {
  accountId: string;
}

export const RemoveSelfDelegate = async ({
  accountId,
  clientApi,
  queryClient,
}: RemoveSelfDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const { data } = await clientApi.delete<ConnectedXMResponse<Account>>(
    `/self/delegates/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_DELEGATES_QUERY_KEY() });
  }

  return data;
};

export const useRemoveSelfDelegate = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveSelfDelegate>>,
    RemoveSelfDelegateParams
  >
) => {
  return useConnectedMutation<
    RemoveSelfDelegateParams,
    Awaited<ReturnType<typeof RemoveSelfDelegate>>
  >(RemoveSelfDelegate, params, options);
};
