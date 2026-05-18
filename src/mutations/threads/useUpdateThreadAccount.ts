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

export interface UpdateThreadAccountParams extends MutationParams {
  threadId: string;
  accountId: string;
  /** Toggle "mute" — when false, suppresses push for this thread. */
  notifications?: boolean;
}

/**
 * Update a participant's metadata on a thread. Self-only on the client
 * surface — passing any other accountId returns 403. Currently only the
 * `notifications` flag is settable from the client; the `blocked` flag
 * is admin-only moderation silencing and lives on the admin SDK.
 */
export const UpdateThreadAccount = async ({
  threadId,
  accountId,
  notifications,
  clientApiParams,
  queryClient,
}: UpdateThreadAccountParams): Promise<ConnectedXMResponse<ThreadAccount>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const body: Record<string, unknown> = {};
  if (notifications !== undefined) body.notifications = notifications;

  const { data } = await clientApi.put(
    `/threads/${threadId}/accounts/${accountId}`,
    body
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

export const useUpdateThreadAccount = (
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateThreadAccount>>,
    Omit<UpdateThreadAccountParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadAccountParams,
    Awaited<ReturnType<typeof UpdateThreadAccount>>
  >(UpdateThreadAccount, options);
};
