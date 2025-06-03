import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { ThreadCircleAccount } from "@src/interfaces";
import { THREAD_CIRCLE_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadCircleAccounts";

export interface AddThreadCircleAccountParams extends MutationParams {
  circleId: string;
  accountId: string;
  role?: string;
}

export const AddThreadCircleAccount = async ({
  circleId,
  accountId,
  role,
  clientApiParams,
  queryClient,
}: AddThreadCircleAccountParams): Promise<
  ConnectedXMResponse<ThreadCircleAccount>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/threads/circles/${circleId}/accounts`,
    {
      accountId,
      role,
    }
  );

  if (queryClient && data.status === "ok") {
    // Invalidate the list query to refetch
    queryClient.invalidateQueries({
      queryKey: THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(circleId),
    });
  }

  return data;
};

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
