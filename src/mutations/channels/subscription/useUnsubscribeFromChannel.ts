import { ConnectedXMResponse, ChannelSubscriber } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_QUERY_KEY,
  REMOVE_SELF_RELATIONSHIP,
  SUBSCRIBED_CHANNELS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Channels
 */
export interface UnsubscribeFromChannelParams extends MutationParams {
  channelId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const UnsubscribeFromChannel = async ({
  channelId,
  clientApiParams,
  queryClient,
}: UnsubscribeFromChannelParams): Promise<
  ConnectedXMResponse<ChannelSubscriber>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<
    ConnectedXMResponse<ChannelSubscriber>
  >(`/channels/${channelId}/subscribers`);

  if (data.status === "ok" && queryClient) {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_QUERY_KEY(channelId),
    });
    queryClient.invalidateQueries({
      queryKey: SUBSCRIBED_CHANNELS_QUERY_KEY(),
    });

    REMOVE_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "channels",
      channelId
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useUnsubscribeFromChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UnsubscribeFromChannel>>,
      Omit<UnsubscribeFromChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UnsubscribeFromChannelParams,
    Awaited<ReturnType<typeof UnsubscribeFromChannel>>
  >(UnsubscribeFromChannel, options);
};
