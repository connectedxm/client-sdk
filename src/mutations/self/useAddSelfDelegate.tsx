import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_DELEGATES_QUERY_KEY } from "@src/queries";

export interface AddSelfDelegateParams extends MutationParams {
  email: string;
}

export const AddSelfDelegate = async ({
  email,
  clientApi,
  queryClient,
}: AddSelfDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/self/delegates`,
    {
      email,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_DELEGATES_QUERY_KEY() });
  }
  return data;
};

export const useAddSelfDelegate = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof AddSelfDelegate>>,
    AddSelfDelegateParams
  >
) => {
  return useConnectedMutation<
    AddSelfDelegateParams,
    Awaited<ReturnType<typeof AddSelfDelegate>>
  >(AddSelfDelegate, params, options);
};
