import { GetClientAPI } from "@src/ClientAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import { SELF_INTERESTS_QUERY_KEY } from "@src/queries";

export interface AddInterestsParams extends MutationParams {
  interestIds: string[];
}

export const AddInterests = async ({
  interestIds,
  clientApiParams,
  queryClient,
}: AddInterestsParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    "/self/interests",
    { interestIds }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_INTERESTS_QUERY_KEY(),
    });
  }

  return data;
};

export const useAddInterests = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddInterests>>,
      Omit<AddInterestsParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddInterestsParams,
    Awaited<ReturnType<typeof AddInterests>>
  >(AddInterests, options);
};
