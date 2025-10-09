import { ConnectedXMResponse, ChannelSubscriber, ActivityPreferences } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

interface UpdateChannelSubscriberPayload {
  contentEmailNotification?: boolean;
  contentPushNotification?: boolean;
  activityPushPreference?: ActivityPreferences;
}

export interface UpdateChannelSubscriberParams extends MutationParams {
  channelId: string;
  channelSubscriber: UpdateChannelSubscriberPayload;
}

export const UpdateChannelSubscriber = async ({
  channelId,
  channelSubscriber,
  clientApiParams,
}: UpdateChannelSubscriberParams): Promise<
  ConnectedXMResponse<ChannelSubscriber>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<ChannelSubscriber>>(
    `/channels/${channelId}/subscribers`,
    channelSubscriber
  );

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
