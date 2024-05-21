import { GetClientAPI } from "@src/ClientAPI";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks";

export const SELF_NOTIFICATION_COUNT_QUERY_KEY = (
  filters: string
): QueryKey => [...SELF_QUERY_KEY(), "NOTIFICATION_COUNT", filters];

export interface GetSelfNewNotificationsCountProps extends SingleQueryParams {
  filters?: string;
}

interface NotifcationCounts {
  notifications: number;
  messages: number;
}

export const GetSelfNewNotificationsCount = async ({
  filters,
  clientApiParams,
}: GetSelfNewNotificationsCountProps): Promise<
  ConnectedXMResponse<NotifcationCounts>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get<ConnectedXMResponse<NotifcationCounts>>(
    `/self/notifications/count`,
    {
      params: {
        filters,
      },
    }
  );
  return data;
};

export const useGetSelfNewNotificationsCount = (
  filters: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfNewNotificationsCount>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfNewNotificationsCount>
  >(
    SELF_NOTIFICATION_COUNT_QUERY_KEY(filters),
    (params) => GetSelfNewNotificationsCount({ filters, ...params }),
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
