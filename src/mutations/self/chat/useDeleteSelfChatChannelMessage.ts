import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY } from "@context/queries/self/chat/useGetSelfChatChannelMessages";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteSelfChatChannelMessageParams extends MutationParams {
  channelId: string;
  messageId: string;
}

export const DeleteSelfChatChannelMessage = async ({
  channelId,
  messageId,
}: DeleteSelfChatChannelMessageParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/self/chat/channels/${channelId}/messages/${messageId}`
  );
  return data;
};

export const useDeleteSelfChatChannelMessage = (
  channelId: string,
  messageId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (
      params: Omit<
        DeleteSelfChatChannelMessageParams,
        "channelId" | "messageId"
      >
    ) => DeleteSelfChatChannelMessage({ ...params, channelId, messageId }),
    {
      onSuccess: (
        _response: Awaited<ReturnType<typeof DeleteSelfChatChannelMessage>>
      ) => {
        queryClient.invalidateQueries(
          SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId)
        );
      },
    }
  );
};

export default useDeleteSelfChatChannelMessage;
