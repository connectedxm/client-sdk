import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ConnectedXMResponse } from "@src/interfaces";

export const SELF_NOTIFICATION_COUNT_QUERY_KEY = (filters: string) => [
  ...SELF_QUERY_KEY(),
  "NOTIFICATION_COUNT",
  filters,
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

const useGetSelfNewNotificationsCount = (
  filters: string = "",
  params: SingleQueryParams = {},
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfNewNotificationsCount>
  > = {}
) => {
  const { token } = useConnectedXM();
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfNewNotificationsCount>
  >(
    SELF_NOTIFICATION_COUNT_QUERY_KEY(filters),
    () => GetSelfNewNotificationsCount({ filters }),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfNewNotificationsCount;
