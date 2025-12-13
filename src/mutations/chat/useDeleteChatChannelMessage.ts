import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { CHAT_CHANNEL_MESSAGES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Chat
 */
export interface DeleteChatChannelMessageParams extends MutationParams {
  channelId: string;
  messageId: string;
}

/**
 * @category Methods
 * @group Chat
 */
export const DeleteChatChannelMessage = async ({
  channelId,
  messageId,
  clientApiParams,
  queryClient,
}: DeleteChatChannelMessageParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/chat/channels/${channelId}/messages/${messageId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Chat
 */
export const useDeleteChatChannelMessage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteChatChannelMessage>>,
      Omit<
        DeleteChatChannelMessageParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChatChannelMessageParams,
    Awaited<ReturnType<typeof DeleteChatChannelMessage>>
  >(DeleteChatChannelMessage, options);
};
