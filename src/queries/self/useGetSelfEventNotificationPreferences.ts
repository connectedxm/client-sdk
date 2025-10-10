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

export interface EventNotificationPreference {
  eventId: string;
  eventName: string;
  activityPushPreference: "all" | "featured" | "none";
}

export const SELF_EVENT_NOTIFICATION_PREFERENCES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENT_NOTIFICATION_PREFERENCES",
];

export interface GetSelfEventNotificationPreferencesProps
  extends SingleQueryParams {}

export const GetSelfEventNotificationPreferences = async ({
  clientApiParams,
}: GetSelfEventNotificationPreferencesProps): Promise<
  ConnectedXMResponse<EventNotificationPreference[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/notificationPreferences`);
  return data;
};

export const useGetSelfEventNotificationPreferences = (
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventNotificationPreferences>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventNotificationPreferences>
  >(
    SELF_EVENT_NOTIFICATION_PREFERENCES_QUERY_KEY(),
    (params: any) => GetSelfEventNotificationPreferences({ ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
