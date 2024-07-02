import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries";

export interface RemoveThreadMessageReactionParams extends MutationParams {
  threadId: string;
  messageId: string;
  emojiName: string;
}

export const RemoveThreadMessageReaction = async ({
  threadId,
  messageId,
  emojiName,
  clientApiParams,
  queryClient,
}: RemoveThreadMessageReactionParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/threads/${threadId}/messages/${messageId}/reactions`,
    {
      data: { emojiName },
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGES_QUERY_KEY(threadId),
    });
  }

  return data;
};

export const useRemoveThreadMessageReaction = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveThreadMessageReaction>>,
      Omit<RemoveThreadMessageReactionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveThreadMessageReactionParams,
    Awaited<ReturnType<typeof RemoveThreadMessageReaction>>
  >(RemoveThreadMessageReaction, options);
};
