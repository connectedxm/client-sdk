import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { THREAD_CIRCLE_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadCircleAccounts";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadCircleAccountParams extends MutationParams {
  circleId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThreadCircleAccount = async ({
  circleId,
  accountId,
  clientApiParams,
  queryClient,
}: DeleteThreadCircleAccountParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(
    `/threads/circles/${circleId}/accounts/${accountId}`
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
export const useDeleteThreadCircleAccount = (
  options: MutationOptions<
    Awaited<ReturnType<typeof DeleteThreadCircleAccount>>,
    Omit<DeleteThreadCircleAccountParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadCircleAccountParams,
    Awaited<ReturnType<typeof DeleteThreadCircleAccount>>
  >(DeleteThreadCircleAccount, options);
};
