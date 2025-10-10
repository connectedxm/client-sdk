import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, ActivityPreference } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export interface EventNotificationPreference {
  eventId: string;
  eventName: string;
  activityNotificationPreference: ActivityPreference;
  announcementPushNotification: boolean;
  announcementEmailNotification: boolean;
}

export const SELF_EVENT_NOTIFICATION_PREFERENCES_QUERY_KEY = (
  excludePast?: boolean
): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENT_NOTIFICATION_PREFERENCES",
  excludePast ? "EXCLUDE_PAST" : "ALL",
];

export interface GetSelfEventNotificationPreferencesProps
  extends SingleQueryParams {
  excludePast?: boolean;
}

export const GetSelfEventNotificationPreferences = async ({
  clientApiParams,
  excludePast,
}: GetSelfEventNotificationPreferencesProps): Promise<
  ConnectedXMResponse<EventNotificationPreference[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/notificationPreferences`, {
    params: {
      excludePast: excludePast || undefined,
    },
  });
  return data;
};

export const useGetSelfEventNotificationPreferences = (
  excludePast: boolean = false,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventNotificationPreferences>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventNotificationPreferences>
  >(
    SELF_EVENT_NOTIFICATION_PREFERENCES_QUERY_KEY(excludePast),
    (params: any) =>
      GetSelfEventNotificationPreferences({ ...params, excludePast }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
