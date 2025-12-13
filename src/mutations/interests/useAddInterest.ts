import { GetClientAPI } from "@src/ClientAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import { SELF_INTERESTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Interests
 */
export interface AddInterestParams extends MutationParams {
  interestIds: string[];
}

/**
 * @category Methods
 * @group Interests
 */
export const AddInterest = async ({
  interestIds,
  clientApiParams,
  queryClient,
}: AddInterestParams): Promise<ConnectedXMResponse<Account>> => {
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

/**
 * @category Mutations
 * @group Interests
 */
export const useAddInterest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddInterest>>,
      Omit<AddInterestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddInterestParams,
    Awaited<ReturnType<typeof AddInterest>>
  >(AddInterest, options);
};
