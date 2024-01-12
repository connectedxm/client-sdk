import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import useConnectedSingleQuery, {
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_NOTIFICATION_COUNT_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "NOTIFICATION_COUNT",
];

interface GetSelfNewNotificationsCountProps extends SingleQueryParams {
  filters?: string;
}

export const GetSelfNewNotificationsCount = async ({
  filters,
  locale,
}: GetSelfNewNotificationsCountProps): Promise<
  ConnectedXMResponse<Notification[]>
> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/notifications/count`, {
    params: {
      filters,
    },
  });
  return data;
};

const useGetSelfNewNotificationsCount = (filters?: string) => {
  const { token } = useConnectedXM();
  return useConnectedSingleQuery<
    Awaited<ReturnType<typeof GetSelfNewNotificationsCount>>
  >(
    SELF_NOTIFICATION_COUNT_QUERY_KEY(),
    () => GetSelfNewNotificationsCount({ filters }),
    {
      enabled: !!token,
      refetchInterval: 1000 * 60, // refetch every 60 seconds
      // refetchIntervalInBackground: true,
    }
  );
};

export default useGetSelfNewNotificationsCount;
