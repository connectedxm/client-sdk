import { ConnectedXMResponse, ChannelSubscription } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

interface UpdateChannelSubscription {
  contentEmailNotification?: boolean;
  contentPushNotification?: boolean;
}

export interface UpdateChannelSubscriptionParams extends MutationParams {
  channelId: string;
  channelSubscription: UpdateChannelSubscription;
}

export const UpdateChannelSubscription = async ({
  channelId,
  channelSubscription,
  clientApiParams,
}: UpdateChannelSubscriptionParams): Promise<
  ConnectedXMResponse<ChannelSubscription>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<
    ConnectedXMResponse<ChannelSubscription>
  >(`/channels/${channelId}/subscriptions`, channelSubscription);

  return data;
};

export const useUpdateChannelSubscription = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateChannelSubscription>>,
      Omit<UpdateChannelSubscriptionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelSubscriptionParams,
    Awaited<ReturnType<typeof UpdateChannelSubscription>>
  >(UpdateChannelSubscription, options);
};
