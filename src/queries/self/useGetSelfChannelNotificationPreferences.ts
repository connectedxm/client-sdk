import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export interface ChannelNotificationPreference {
  channelId: string;
  channelName: string;
  activityPushPreference: "all" | "featured" | "none";
  contentPush: boolean;
  contentEmail: boolean;
}

export const SELF_CHANNEL_NOTIFICATION_PREFERENCES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "CHANNEL_NOTIFICATION_PREFERENCES",
];

export interface GetSelfChannelNotificationPreferencesProps
  extends SingleQueryParams {}

export const GetSelfChannelNotificationPreferences = async ({
  clientApiParams,
}: GetSelfChannelNotificationPreferencesProps): Promise<
  ConnectedXMResponse<ChannelNotificationPreference[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/channels/notificationPreferences`
  );
  return data;
};

export const useGetSelfChannelNotificationPreferences = (
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfChannelNotificationPreferences>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfChannelNotificationPreferences>
  >(
    SELF_CHANNEL_NOTIFICATION_PREFERENCES_QUERY_KEY(),
    (params: any) => GetSelfChannelNotificationPreferences({ ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
