import { GetClientAPI } from "@src/ClientAPI";
import { ChatChannelMember, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_CHAT_CHANNELS_QUERY_KEY,
  SET_SELF_CHAT_CHANNEL_QUERY_DATA,
} from "@src/queries";

export interface UpdateSelfChatChannelNotificationsParams
  extends MutationParams {
  channelId: string;
  notifications: boolean;
}

export const UpdateSelfChatChannelNotifications = async ({
  channelId,
  notifications,
  clientApiParams,
  queryClient,
}: UpdateSelfChatChannelNotificationsParams): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<ChatChannelMember>>(
    `/self/chat/channels/${channelId}/notifications`,
    {
      notifications,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_CHAT_CHANNEL_QUERY_DATA(queryClient, [channelId], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({
      queryKey: SELF_CHAT_CHANNELS_QUERY_KEY(),
    });
  }

  return data;
};

export const useUpdateSelfChatChannelNotifications = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfChatChannelNotifications>>,
      Omit<
        UpdateSelfChatChannelNotificationsParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfChatChannelNotificationsParams,
    Awaited<ReturnType<typeof UpdateSelfChatChannelNotifications>>
  >(UpdateSelfChatChannelNotifications, options);
};
