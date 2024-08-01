import { ConnectedXMResponse, ChannelSubscriber } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_QUERY_KEY,
  REMOVE_SELF_RELATIONSHIP,
  SUBSCRIBED_CHANNELS_QUERY_KEY,
} from "@src/queries";

export interface DeleteChannelSubscriberParams extends MutationParams {
  channelId: string;
}

export const DeleteChannelSubscriber = async ({
  channelId,
  clientApiParams,
  queryClient,
}: DeleteChannelSubscriberParams): Promise<
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

export const useDeleteChannelSubscriber = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteChannelSubscriber>>,
      Omit<DeleteChannelSubscriberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelSubscriberParams,
    Awaited<ReturnType<typeof DeleteChannelSubscriber>>
  >(DeleteChannelSubscriber, options);
};
