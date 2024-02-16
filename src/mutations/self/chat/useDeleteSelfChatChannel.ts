import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNEL_QUERY_KEY } from "@context/queries/self/chat/useGetSelfChatChannel";
import { SELF_CHAT_CHANNELS_QUERY_KEY } from "@context/queries/self/chat/useGetSelfChatChannels";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteSelfChatChannelParams extends MutationParams {
  channelId: string;
}

export const DeleteSelfChatChannel = async ({
  channelId,
}: DeleteSelfChatChannelParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/self/chat/channels/${channelId}`);
  return data;
};

export const useDeleteSelfChatChannel = (channelId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (params: Omit<DeleteSelfChatChannelParams, "channelId">) =>
      DeleteSelfChatChannel({ ...params, channelId }),
    {
      onSuccess: (
        _response: Awaited<ReturnType<typeof DeleteSelfChatChannel>>
      ) => {
        queryClient.invalidateQueries(SELF_CHAT_CHANNELS_QUERY_KEY());
        queryClient.removeQueries(SELF_CHAT_CHANNEL_QUERY_KEY(channelId));
      },
    }
  );
};

export default useDeleteSelfChatChannel;
