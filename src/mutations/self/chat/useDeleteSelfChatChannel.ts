import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_CHAT_CHANNELS_QUERY_KEY,
  SELF_CHAT_CHANNEL_QUERY_KEY,
} from "@src/queries";

export interface DeleteSelfChatChannelParams extends MutationParams {
  channelId: string;
}

export const DeleteSelfChatChannel = async ({
  channelId,
  clientApiParams,
  queryClient,
}: DeleteSelfChatChannelParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/chat/channels/${channelId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_CHAT_CHANNELS_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: SELF_CHAT_CHANNEL_QUERY_KEY(channelId),
    });
  }

  return data;
};

export const useDeleteSelfChatChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteSelfChatChannel>>,
      Omit<DeleteSelfChatChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfChatChannelParams,
    Awaited<ReturnType<typeof DeleteSelfChatChannel>>
  >(DeleteSelfChatChannel, options);
};
