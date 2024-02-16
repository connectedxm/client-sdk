import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { ConnectedXMResponse, NotificationPreferences } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";

export const SELF_PREFERENCES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "PREFERENCES",
];

interface GetSelfNotificationPreferencesProps extends SingleQueryParams {}

export const GetSelfNotificationPreferences = async ({
  clientApi,
}: GetSelfNotificationPreferencesProps): Promise<
  ConnectedXMResponse<NotificationPreferences>
> => {
  const { data } = await clientApi.get(`/self/notificationPreferences`);
  return data;
};

export const useGetSelfNotificationPreferences = (
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfNotificationPreferences>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfNotificationPreferences>
  >(
    SELF_PREFERENCES_QUERY_KEY(),
    (params: any) => GetSelfNotificationPreferences({ ...params }),
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};
