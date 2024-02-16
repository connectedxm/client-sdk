import { useConnectedXM } from "@src/hooks/useConnectedXM";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";

export const SELF_NOTIFICATIONS_QUERY_KEY = (filters: string): QueryKey => [
  ...SELF_QUERY_KEY(),
  "NOTIFICATIONS",
  filters,
];

interface GetSelfNotificationsProps extends InfiniteQueryParams {
  filters?: string;
}

export const GetSelfNotifications = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  filters,
  clientApi,
}: GetSelfNotificationsProps): Promise<ConnectedXMResponse<Notification[]>> => {
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

export const useGetSelfNotifications = (
  filters: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfNotifications>>
  > = {}
) => {
  const { token } = useConnectedXM();
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfNotifications>>
  >(
    SELF_NOTIFICATIONS_QUERY_KEY(filters),
    (params: InfiniteQueryParams) =>
      GetSelfNotifications({ ...params, filters }),
    params,
    {
      staleTime: 0,
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};
