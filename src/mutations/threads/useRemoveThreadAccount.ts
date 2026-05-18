import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { THREAD_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadAccounts";
import { THREAD_QUERY_KEY } from "@src/queries/threads/useGetThread";
import { THREADS_QUERY_KEY } from "@src/queries/threads/useGetThreads";

export interface RemoveThreadAccountParams extends MutationParams {
  threadId: string;
  accountId: string;
}

/**
 * Remove a participant from a thread. Any member of the thread may remove
 * any other participant (same trust model as adding). Passing one's own
 * accountId is the "leave thread" path.
 */
export const RemoveThreadAccount = async ({
  threadId,
  accountId,
  clientApiParams,
  queryClient,
}: RemoveThreadAccountParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(
    `/threads/${threadId}/accounts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_ACCOUNTS_QUERY_KEY(threadId),
    });
    queryClient.invalidateQueries({ queryKey: THREAD_QUERY_KEY(threadId) });
    queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY() });
  }

  return data;
};

export const useRemoveThreadAccount = (
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveThreadAccount>>,
    Omit<RemoveThreadAccountParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    RemoveThreadAccountParams,
    Awaited<ReturnType<typeof RemoveThreadAccount>>
  >(RemoveThreadAccount, options);
};
