import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ThreadCircleAccount } from "@src/interfaces";
import { SET_THREAD_CIRCLE_ACCOUNT_QUERY_DATA } from "@src/queries";
import { ThreadCircleAccountUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Threads
 */
export interface UpdateThreadCircleAccountParams extends MutationParams {
  circleId: string;
  accountId: string;
  account: ThreadCircleAccountUpdateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThreadCircleAccount = async ({
  circleId,
  accountId,
  account,
  clientApiParams,
  queryClient,
}: UpdateThreadCircleAccountParams): Promise<
  ConnectedXMResponse<ThreadCircleAccount>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put(
    `/threads/circles/${circleId}/accounts/${accountId}`,
    account
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_CIRCLE_ACCOUNT_QUERY_DATA(
      queryClient,
      [circleId, accountId],
      data,
      [clientApiParams.locale]
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useUpdateThreadCircleAccount = (
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateThreadCircleAccount>>,
    Omit<UpdateThreadCircleAccountParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadCircleAccountParams,
    Awaited<ReturnType<typeof UpdateThreadCircleAccount>>
  >(UpdateThreadCircleAccount, options);
};
