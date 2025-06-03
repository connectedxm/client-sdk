import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";

export interface RemoveThreadMessageReactionParams extends MutationParams {
  threadId: string;
  messageId: string;
  reactionId: string;
}

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
