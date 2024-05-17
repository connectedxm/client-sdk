import { GetClientAPI } from "@src/ClientAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import { SELF_INTERESTS_QUERY_KEY } from "@src/queries";

export interface AddInterestsAccountParams extends MutationParams {
  interestIds: string[];
  accountId: string;
}

export const AddInterestsAccount = async ({
  accountId,
  interestIds,
  clientApiParams,
  queryClient,
}: AddInterestsAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/interests`,
    { interestIds }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_INTERESTS_QUERY_KEY(),
    });
  }

  return data;
};

export const useAddInterestsAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddInterestsAccount>>,
      Omit<AddInterestsAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddInterestsAccountParams,
    Awaited<ReturnType<typeof AddInterestsAccount>>
  >(AddInterestsAccount, options);
};
