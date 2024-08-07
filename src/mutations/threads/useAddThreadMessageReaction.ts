import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMessageReaction } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries";

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
  const { data } = await clientApi.post<
    ConnectedXMResponse<ThreadMessageReaction>
  >(`/threads/${threadId}/messages/${messageId}/reactions`, { emojiName });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGES_QUERY_KEY(threadId),
    });
  }

  return data;
};

export const useAddThreadMessageReaction = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddThreadMessageReaction>>,
      Omit<AddThreadMessageReactionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddThreadMessageReactionParams,
    Awaited<ReturnType<typeof AddThreadMessageReaction>>
  >(AddThreadMessageReaction, options);
};
