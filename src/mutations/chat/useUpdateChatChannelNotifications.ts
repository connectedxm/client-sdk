import { GetClientAPI } from "@src/ClientAPI";
import { ChatChannelMember, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  CHAT_CHANNELS_QUERY_KEY,
  SET_CHAT_CHANNEL_QUERY_DATA,
} from "@src/queries";
import { ChatChannelNotificationsUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Chat
 */
export interface UpdateChatChannelNotificationsParams extends MutationParams {
  channelId: string;
  notifications: ChatChannelNotificationsUpdateInputs;
}

/**
 * @category Methods
 * @group Chat
 */
export const UpdateChatChannelNotifications = async ({
  channelId,
  notifications,
  clientApiParams,
  queryClient,
}: UpdateChatChannelNotificationsParams): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<ChatChannelMember>>(
    `/self/chat/channels/${channelId}/notifications`,
    notifications
  );

  if (queryClient && data.status === "ok") {
    SET_CHAT_CHANNEL_QUERY_DATA(queryClient, [channelId], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({
      queryKey: CHAT_CHANNELS_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Chat
 */
export const useUpdateChatChannelNotifications = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateChatChannelNotifications>>,
      Omit<
        UpdateChatChannelNotificationsParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChatChannelNotificationsParams,
    Awaited<ReturnType<typeof UpdateChatChannelNotifications>>
  >(UpdateChatChannelNotifications, options);
};
