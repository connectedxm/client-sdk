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

export interface GroupNotificationPreference {
  groupId: string;
  groupName: string;
  activityPushPreference: "all" | "featured" | "none";
}

export const SELF_GROUP_NOTIFICATION_PREFERENCES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "GROUP_NOTIFICATION_PREFERENCES",
];

export interface GetSelfGroupNotificationPreferencesProps
  extends SingleQueryParams {}

export const GetSelfGroupNotificationPreferences = async ({
  clientApiParams,
}: GetSelfGroupNotificationPreferencesProps): Promise<
  ConnectedXMResponse<GroupNotificationPreference[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/groups/notificationPreferences`);
  return data;
};

export const useGetSelfGroupNotificationPreferences = (
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfGroupNotificationPreferences>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfGroupNotificationPreferences>
  >(
    SELF_GROUP_NOTIFICATION_PREFERENCES_QUERY_KEY(),
    (params: any) => GetSelfGroupNotificationPreferences({ ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
