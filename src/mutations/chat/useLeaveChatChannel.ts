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
export interface LeaveChatChannelParams extends MutationParams {
  channelId: string;
}

/**
 * @category Methods
 * @group Chat
 */
export const LeaveChatChannel = async ({
  channelId,
  clientApiParams,
  queryClient,
}: LeaveChatChannelParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/chat/channels/${channelId}/leave`
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
export const useLeaveChatChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof LeaveChatChannel>>,
      Omit<LeaveChatChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    LeaveChatChannelParams,
    Awaited<ReturnType<typeof LeaveChatChannel>>
  >(LeaveChatChannel, options);
};
