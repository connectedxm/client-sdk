import { ConnectedXMResponse, ChannelSubscription } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface CreateChannelSubscriptionParams extends MutationParams {
  channelId: string;
}

export const CreateChannelSubscription = async ({
  channelId,
  clientApiParams,
}: CreateChannelSubscriptionParams): Promise<
  ConnectedXMResponse<ChannelSubscription>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<ChannelSubscription>
  >(`/channels/${channelId}/subscriptions`);

  return data;
};

export const useCreateChannelSubscription = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChannelSubscription>>,
      Omit<CreateChannelSubscriptionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelSubscriptionParams,
    Awaited<ReturnType<typeof CreateChannelSubscription>>
  >(CreateChannelSubscription, options);
};
