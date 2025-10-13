import {
  ConnectedXMResponse,
  ChannelSubscriber,
  ActivityPreference,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import {
  SELF_CHANNEL_SUBSCRIBER_QUERY_KEY,
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
} from "@src/queries";

import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateChannelSubscriberParams extends MutationParams {
  channelId: string;
  contentEmailNotification?: boolean;
  contentPushNotification?: boolean;
  activityNotificationPreference?: ActivityPreference;
}

export const UpdateChannelSubscriber = async ({
  channelId,
  contentEmailNotification,
  contentPushNotification,
  activityNotificationPreference,
  clientApiParams,
  queryClient,
}: UpdateChannelSubscriberParams): Promise<
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
              contentEmailNotification,
              contentPushNotification,
              activityNotificationPreference,
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
    {
      contentEmailNotification,
      contentPushNotification,
      activityNotificationPreference,
    }
  );

  // Invalidate channel subscribers queries to ensure UI updates
  if (queryClient) {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
  }

  return data;
};

export const useUpdateChannelSubscriber = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateChannelSubscriber>>,
      Omit<UpdateChannelSubscriberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelSubscriberParams,
    Awaited<ReturnType<typeof UpdateChannelSubscriber>>
  >(UpdateChannelSubscriber, options);
};
