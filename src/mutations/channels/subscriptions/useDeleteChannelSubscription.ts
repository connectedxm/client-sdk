import { ConnectedXMResponse, ChannelSubscription } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteChannelSubscriptionParams extends MutationParams {
  channelId: string;
}

export const DeleteChannelSubscription = async ({
  channelId,
  clientApiParams,
}: DeleteChannelSubscriptionParams): Promise<
  ConnectedXMResponse<ChannelSubscription>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<
    ConnectedXMResponse<ChannelSubscription>
  >(`/channels/${channelId}/subscriptions`);

  return data;
};

export const useDeleteChannelSubscription = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteChannelSubscription>>,
      Omit<DeleteChannelSubscriptionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelSubscriptionParams,
    Awaited<ReturnType<typeof DeleteChannelSubscription>>
  >(DeleteChannelSubscription, options);
};
