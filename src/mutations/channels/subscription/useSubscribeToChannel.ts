import { ConnectedXMResponse, ChannelSubscriber } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  ADD_SELF_RELATIONSHIP,
  CHANNEL_QUERY_KEY,
  SUBSCRIBED_CHANNELS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Channels
 */
export interface SubscribeToChannelParams extends MutationParams {
  channelId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const SubscribeToChannel = async ({
  channelId,
  clientApiParams,
  queryClient,
}: SubscribeToChannelParams): Promise<
  ConnectedXMResponse<ChannelSubscriber>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChannelSubscriber>>(
    `/channels/${channelId}/subscribers`
  );

  if (data.status === "ok" && queryClient) {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_QUERY_KEY(channelId),
    });
    queryClient.invalidateQueries({
      queryKey: SUBSCRIBED_CHANNELS_QUERY_KEY(),
    });

    ADD_SELF_RELATIONSHIP(
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
export const useSubscribeToChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubscribeToChannel>>,
      Omit<SubscribeToChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubscribeToChannelParams,
    Awaited<ReturnType<typeof SubscribeToChannel>>
  >(SubscribeToChannel, options);
};
