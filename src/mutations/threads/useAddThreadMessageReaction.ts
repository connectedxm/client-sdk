import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { ThreadMessageReaction } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";

export interface AddThreadMessageReactionParams extends MutationParams {
  threadId: string;
  messageId: string;
  emojiName: string;
}

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
