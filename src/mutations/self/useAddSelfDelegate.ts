import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_DELEGATES_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface AddSelfDelegateParams extends MutationParams {
  email: string;
}

export const AddSelfDelegate = async ({
  email,
  clientApiParams,
  queryClient,
}: AddSelfDelegateParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfDelegate>>,
      Omit<AddSelfDelegateParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfDelegateParams,
    Awaited<ReturnType<typeof AddSelfDelegate>>
  >(AddSelfDelegate, options);
};
