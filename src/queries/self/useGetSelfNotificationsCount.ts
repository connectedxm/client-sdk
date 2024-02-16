import { useConnectedXM } from "@src/hooks/useConnectedXM";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";

export const SELF_NOTIFICATION_COUNT_QUERY_KEY = (
  filters: string
): QueryKey => [...SELF_QUERY_KEY(), "NOTIFICATION_COUNT", filters];

interface GetSelfNewNotificationsCountProps extends SingleQueryParams {
  filters?: string;
}

export const GetSelfNewNotificationsCount = async ({
  filters,
  clientApi,
}: GetSelfNewNotificationsCountProps): Promise<
  ConnectedXMResponse<Notification[]>
> => {
  const { data } = await clientApi.get(`/self/notifications/count`, {
    params: {
      filters,
    },
  });
  return data;
};

export const useGetSelfNewNotificationsCount = (
  filters: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfNewNotificationsCount>
  > = {}
) => {
  const { token } = useConnectedXM();
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfNewNotificationsCount>
  >(
    SELF_NOTIFICATION_COUNT_QUERY_KEY(filters),
    (params) => GetSelfNewNotificationsCount({ filters, ...params }),
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};
