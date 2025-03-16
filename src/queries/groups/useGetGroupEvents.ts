import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Event } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_EVENTS_QUERY_KEY = (
  groupId: string,
  past?: boolean
): QueryKey => [
  ...GROUP_QUERY_KEY(groupId),
  "EVENTS",
  past ? "PAST" : "UPCOMING",
];

export interface GetGroupEventsProps extends InfiniteQueryParams {
  groupId: string;
  past?: boolean;
}

export const GetGroupEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  groupId,
  past,
  clientApiParams,
}: GetGroupEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past || false,
    },
  });

  return data;
};

export const useGetGroupEvents = (
  groupId: string = "",
  past: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetGroupEvents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroupEvents>>>(
    GROUP_EVENTS_QUERY_KEY(groupId, past),
    (params: InfiniteQueryParams) =>
      GetGroupEvents({ groupId, past, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
