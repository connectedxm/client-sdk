import { GetClientAPI } from "@src/ClientAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ConnectedXMResponse, Notification } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks";

export const SELF_NOTIFICATIONS_QUERY_KEY = (filters: string): QueryKey => [
  ...SELF_QUERY_KEY(),
  "NOTIFICATIONS",
  filters,
];

export interface GetSelfNotificationsProps extends InfiniteQueryParams {
  filters?: string;
}

export const GetSelfNotifications = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  filters,
  clientApiParams,
}: GetSelfNotificationsProps): Promise<ConnectedXMResponse<Notification[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfNotifications>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

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
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
