import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ThreadCircleAccount } from "@src/interfaces";
import { THREAD_CIRCLE_ACCOUNTS_QUERY_KEY } from "@src/queries";
import { ThreadCircleAccountCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Threads
 */
export interface AddThreadCircleAccountParams extends MutationParams {
  circleId: string;
  account: ThreadCircleAccountCreateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const AddThreadCircleAccount = async ({
  circleId,
  account,
  clientApiParams,
  queryClient,
}: AddThreadCircleAccountParams): Promise<
  ConnectedXMResponse<ThreadCircleAccount>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/threads/circles/${circleId}/accounts`,
    account
  );

  if (queryClient && data.status === "ok") {
    // Invalidate the list query to refetch
    queryClient.invalidateQueries({
      queryKey: THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(circleId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useAddThreadCircleAccount = (
  options: MutationOptions<
    Awaited<ReturnType<typeof AddThreadCircleAccount>>,
    Omit<AddThreadCircleAccountParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    AddThreadCircleAccountParams,
    Awaited<ReturnType<typeof AddThreadCircleAccount>>
  >(AddThreadCircleAccount, options);
};
