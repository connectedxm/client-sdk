import {
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import type { NotificationPreferences } from "@interfaces";
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

const useGetSelfNotificationPreferences = () => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<
    Awaited<ReturnType<typeof GetSelfNotificationPreferences>>
  >(
    SELF_PREFERENCES_QUERY_KEY(),
    (params: any) => GetSelfNotificationPreferences({ ...params }),
    {
      enabled: !!token,
    }
  );
};

export default useGetSelfNotificationPreferences;
