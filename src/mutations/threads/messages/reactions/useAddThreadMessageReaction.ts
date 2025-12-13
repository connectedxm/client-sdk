import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ThreadMessageReaction } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface AddThreadMessageReactionParams extends MutationParams {
  threadId: string;
  messageId: string;
  emojiName: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const AddThreadMessageReaction = async ({
  threadId,
  messageId,
  emojiName,
  clientApiParams,
  queryClient,
}: AddThreadMessageReactionParams): Promise<
  ConnectedXMResponse<ThreadMessageReaction>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/threads/${threadId}/messages/${messageId}/reactions`,
    {
      emojiName,
    }
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
export const useAddThreadMessageReaction = (
  options: MutationOptions<
    Awaited<ReturnType<typeof AddThreadMessageReaction>>,
    Omit<AddThreadMessageReactionParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    AddThreadMessageReactionParams,
    Awaited<ReturnType<typeof AddThreadMessageReaction>>
  >(AddThreadMessageReaction, options);
};
