import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNEL_QUERY_KEY } from "@context/queries/self/chat/useGetSelfChatChannel";
import { SELF_CHAT_CHANNELS_QUERY_KEY } from "@context/queries/self/chat/useGetSelfChatChannels";
import { useQueryClient } from "@tanstack/react-query";

interface LeaveSelfChatChannelParams extends MutationParams {
  channelId: string;
}

export const LeaveSelfChatChannel = async ({
  channelId,
}: LeaveSelfChatChannelParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/self/chat/channels/${channelId}/leave`
  );
  return data;
};

export const useLeaveSelfChatChannel = (channelId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (params: Omit<LeaveSelfChatChannelParams, "channelId">) =>
      LeaveSelfChatChannel({ ...params, channelId }),
    {
      onSuccess: (
        _response: Awaited<ReturnType<typeof LeaveSelfChatChannel>>
      ) => {
        queryClient.invalidateQueries(SELF_CHAT_CHANNELS_QUERY_KEY());
        queryClient.removeQueries(SELF_CHAT_CHANNEL_QUERY_KEY(channelId));
      },
    }
  );
};

export default useLeaveSelfChatChannel;
