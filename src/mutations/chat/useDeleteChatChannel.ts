import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "@src/mutations/useConnectedMutation";
import {
  CHAT_CHANNELS_QUERY_KEY,
  CHAT_CHANNEL_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Chat
 */
export interface DeleteChatChannelParams extends MutationParams {
  channelId: string;
}

/**
 * @category Methods
 * @group Chat
 */
export const DeleteChatChannel = async ({
  channelId,
  clientApiParams,
  queryClient,
}: DeleteChatChannelParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/chat/channels/${channelId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: CHAT_CHANNELS_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: CHAT_CHANNEL_QUERY_KEY(channelId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Chat
 */
export const useDeleteChatChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteChatChannel>>,
      Omit<DeleteChatChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChatChannelParams,
    Awaited<ReturnType<typeof DeleteChatChannel>>
  >(DeleteChatChannel, options);
};
