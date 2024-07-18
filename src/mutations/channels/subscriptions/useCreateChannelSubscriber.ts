import { ConnectedXMResponse, ChannelSubscriber } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface CreateChannelSubscriberParams extends MutationParams {
  channelId: string;
}

export const CreateChannelSubscriber = async ({
  channelId,
  clientApiParams,
}: CreateChannelSubscriberParams): Promise<
  ConnectedXMResponse<ChannelSubscriber>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChannelSubscriber>>(
    `/channels/${channelId}/subscriptions`
  );

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
