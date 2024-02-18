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
  clientApi,
  queryClient,
}: LeaveSelfChatChannelParams): Promise<ConnectedXMResponse<null>> => {
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
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof LeaveSelfChatChannel>>,
      Omit<LeaveSelfChatChannelParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    LeaveSelfChatChannelParams,
    Awaited<ReturnType<typeof LeaveSelfChatChannel>>
  >(LeaveSelfChatChannel, params, options);
};
