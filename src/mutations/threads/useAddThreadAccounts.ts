import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadAccount } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { THREAD_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadAccounts";
import { THREAD_QUERY_KEY } from "@src/queries/threads/useGetThread";
import { THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreads";

export interface AddThreadAccountsParams extends MutationParams {
  threadId: string;
  accountIds: string[];
}

/**
 * Bulk-add participants to a thread. Caller must already be a member.
 * Idempotent — ids that are already in the thread are skipped server-side.
 * Total participants capped at 32.
 */
export const AddThreadAccounts = async ({
  threadId,
  accountIds,
  clientApiParams,
  queryClient,
}: AddThreadAccountsParams): Promise<
  ConnectedXMResponse<ThreadAccount[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(`/threads/${threadId}/accounts`, {
    accountIds,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_ACCOUNTS_QUERY_KEY(threadId),
    });
    queryClient.invalidateQueries({ queryKey: THREAD_QUERY_KEY(threadId) });
    queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY() });
  }

  return data;
};

export const useAddThreadAccounts = (
  options: MutationOptions<
    Awaited<ReturnType<typeof AddThreadAccounts>>,
    Omit<AddThreadAccountsParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    AddThreadAccountsParams,
    Awaited<ReturnType<typeof AddThreadAccounts>>
  >(AddThreadAccounts, options);
};
