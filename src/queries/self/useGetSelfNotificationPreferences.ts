import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import type { ConnectedXMResponse, NotificationPreferences } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_PREFERENCES_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "PREFERENCES",
];

interface GetSelfNotificationPreferencesProps extends SingleQueryParams {}

export const GetSelfNotificationPreferences = async ({
  locale,
}: GetSelfNotificationPreferencesProps): Promise<
  ConnectedXMResponse<NotificationPreferences>
> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/notificationPreferences`);
  return data;
};

const useGetSelfNotificationPreferences = (
  params: SingleQueryParams = {},
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
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfNotificationPreferences;
