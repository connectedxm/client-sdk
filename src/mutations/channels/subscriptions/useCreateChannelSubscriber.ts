import { ConnectedXMResponse, ChannelSubscriber } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  ADD_SELF_RELATIONSHIP,
  CHANNEL_QUERY_KEY,
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
} from "@src/queries";

export interface CreateChannelSubscriberParams extends MutationParams {
  channelId: string;
}

export const CreateChannelSubscriber = async ({
  channelId,
  clientApiParams,
  queryClient,
}: CreateChannelSubscriberParams): Promise<
  ConnectedXMResponse<ChannelSubscriber>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChannelSubscriber>>(
    `/channels/${channelId}/subscribers`
  );

  if (data.status === "ok" && queryClient) {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_QUERY_KEY(channelId),
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

export const useCreateChannelSubscriber = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChannelSubscriber>>,
      Omit<CreateChannelSubscriberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelSubscriberParams,
    Awaited<ReturnType<typeof CreateChannelSubscriber>>
  >(CreateChannelSubscriber, options);
};
