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

export interface LeaveSelfChatChannelParams extends MutationParams {
  channelId: string;
}

export const LeaveSelfChatChannel = async ({
  channelId,
  clientApiParams,
  queryClient,
}: LeaveSelfChatChannelParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/chat/channels/${channelId}/leave`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_CHAT_CHANNELS_QUERY_KEY() });
    queryClient.removeQueries({
      queryKey: SELF_CHAT_CHANNEL_QUERY_KEY(channelId),
    });
  }

  return data;
};

export const useLeaveSelfChatChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof LeaveSelfChatChannel>>,
      Omit<LeaveSelfChatChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    LeaveSelfChatChannelParams,
    Awaited<ReturnType<typeof LeaveSelfChatChannel>>
  >(LeaveSelfChatChannel, options);
};
