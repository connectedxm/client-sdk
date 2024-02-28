import { GetClientAPI } from "@src/ClientAPI";
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
  clientApiParams,
  queryClient,
}: DeleteSelfChatChannelMessageParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteSelfChatChannelMessage>>,
      Omit<
        DeleteSelfChatChannelMessageParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfChatChannelMessageParams,
    Awaited<ReturnType<typeof DeleteSelfChatChannelMessage>>
  >(DeleteSelfChatChannelMessage, options);
};
