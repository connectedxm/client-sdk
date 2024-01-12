import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_NOTIFICATIONS_QUERY_KEY = (filters?: string) => {
  let keys = [...SELF_QUERY_KEY(), "NOTIFICATIONS"];
  if (typeof filters !== "undefined") {
    keys.push(filters);
  }
  return keys;
};

interface GetSelfNotificationsProps extends InfiniteQueryParams {
  filters?: string;
}

export const GetSelfNotifications = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  filters,
  locale,
}: GetSelfNotificationsProps): Promise<ConnectedXMResponse<Notification[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/notifications`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      filters: filters || undefined,
    },
  });
  return data;
};

const useGetSelfNotifications = (filters?: string) => {
  const { token } = useConnectedXM();
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfNotifications>>
  >(
    SELF_NOTIFICATIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetSelfNotifications({ ...params, filters }),
    {
      enabled: !!token,
      staleTime: 0,
    }
  );
};

export default useGetSelfNotifications;
