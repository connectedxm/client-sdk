import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface RemoveThreadMessageReactionParams extends MutationParams {
  threadId: string;
  messageId: string;
  reactionId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const RemoveThreadMessageReaction = async ({
  threadId,
  messageId,
  reactionId,
  clientApiParams,
  queryClient,
}: RemoveThreadMessageReactionParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(
    `/threads/${threadId}/messages/${messageId}/reactions/${reactionId}`
  );

  if (queryClient && data.status === "ok") {
    // Invalidate the messages list to refetch with updated reactions
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGES_QUERY_KEY(threadId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useRemoveThreadMessageReaction = (
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveThreadMessageReaction>>,
    Omit<RemoveThreadMessageReactionParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    RemoveThreadMessageReactionParams,
    Awaited<ReturnType<typeof RemoveThreadMessageReaction>>
  >(RemoveThreadMessageReaction, options);
};
