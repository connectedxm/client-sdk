import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY } from "@src/queries";

export interface DeleteSelfChatChannelMessageParams extends MutationParams {
  channelId: string;
  messageId: string;
}

export const DeleteSelfChatChannelMessage = async ({
  channelId,
  messageId,
  clientApi,
  queryClient,
}: DeleteSelfChatChannelMessageParams): Promise<ConnectedXMResponse<null>> => {
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/chat/channels/${channelId}/messages/${messageId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId),
    });
  }

  return data;
};

export const useDeleteSelfChatChannelMessage = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof DeleteSelfChatChannelMessage>>,
    DeleteSelfChatChannelMessageParams
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfChatChannelMessageParams,
    Awaited<ReturnType<typeof DeleteSelfChatChannelMessage>>
  >(DeleteSelfChatChannelMessage, params, options);
};
