import { ConnectedXMResponse, ChannelSubscriber } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_CHANNEL_SUBSCRIBER_QUERY_KEY,
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
} from "@src/queries";

import { GetClientAPI } from "@src/ClientAPI";
import { ChannelSubscriberUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface UpdateChannelSubscriptionParams extends MutationParams {
  channelId: string;
  subscription: ChannelSubscriberUpdateInputs;
}

/**
 * @category Methods
 * @group Channels
 */
export const UpdateChannelSubscription = async ({
  channelId,
  subscription,
  clientApiParams,
  queryClient,
}: UpdateChannelSubscriptionParams): Promise<
  ConnectedXMResponse<ChannelSubscriber>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...SELF_CHANNEL_SUBSCRIBER_QUERY_KEY(channelId), clientApiParams.locale],
      (oldData: any) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              ...subscription,
            },
          };
        }
        return oldData;
      }
    );
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<ChannelSubscriber>>(
    `/channels/${channelId}/subscribers`,
    subscription
  );

  // Invalidate channel subscribers queries to ensure UI updates
  if (queryClient) {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
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
