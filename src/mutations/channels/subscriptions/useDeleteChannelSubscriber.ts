import { ConnectedXMResponse, ChannelSubscriber } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteChannelSubscriberParams extends MutationParams {
  channelId: string;
}

export const DeleteChannelSubscriber = async ({
  channelId,
  clientApiParams,
}: DeleteChannelSubscriberParams): Promise<
  ConnectedXMResponse<ChannelSubscriber>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<
    ConnectedXMResponse<ChannelSubscriber>
  >(`/channels/${channelId}/subscriptions`);

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
