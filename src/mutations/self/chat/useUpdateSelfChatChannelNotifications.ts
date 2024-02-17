import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { ChatChannelMember } from "@context/interfaces";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { SET_SELF_CHAT_CHANNEL_QUERY_DATA } from "@context/queries/self/chat/useGetSelfChatChannel";
import { SELF_CHAT_CHANNELS_QUERY_KEY } from "@context/queries/self/chat/useGetSelfChatChannels";
import { useQueryClient } from "@tanstack/react-query";

export interface UpdateSelfChatChannelNotificationsParams
  extends MutationParams {
  channelId: string;
  notifications: boolean;
}

export const UpdateSelfChatChannelNotifications = async ({
  channelId,
  notifications,
}: UpdateSelfChatChannelNotificationsParams): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/self/chat/channels/${channelId}/notifications`,
    {
      notifications,
    }
  );
  return data;
};

export const useUpdateSelfChatChannelNotifications = (channelId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (params: Omit<UpdateSelfChatChannelNotificationsParams, "channelId">) =>
      UpdateSelfChatChannelNotifications({ ...params, channelId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateSelfChatChannelNotifications>>
      ) => {
        queryClient.invalidateQueries(SELF_CHAT_CHANNELS_QUERY_KEY());
        SET_SELF_CHAT_CHANNEL_QUERY_DATA(
          queryClient,
          [response.data.channelId.toString()],
          response
        );
      },
    }
  );
};

export default useUpdateSelfChatChannelNotifications;
