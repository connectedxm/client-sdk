import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, NotificationPreferences } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_PREFERENCES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "PREFERENCES",
];

export interface GetSelfNotificationPreferencesProps
  extends SingleQueryParams {}

export const GetSelfNotificationPreferences = async ({
  clientApiParams,
}: GetSelfNotificationPreferencesProps): Promise<
  ConnectedXMResponse<NotificationPreferences>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/notificationPreferences`);
  return data;
};

export const useGetSelfNotificationPreferences = (
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfNotificationPreferences>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfNotificationPreferences>
  >(
    SELF_PREFERENCES_QUERY_KEY(),
    (params: any) => GetSelfNotificationPreferences({ ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
