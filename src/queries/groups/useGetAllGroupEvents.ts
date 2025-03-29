import type { Event } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENTS_QUERY_KEY } from "../events";

export const ALL_GROUP_EVENTS = (past?: boolean): QueryKey => [
  ...EVENTS_QUERY_KEY(past),
  "GROUPS_EVENTS",
];

export interface GetAllGroupEventsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetAllGroupEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  clientApiParams,
}: GetAllGroupEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past !== undefined ? past : undefined,
    },
  });

  return data;
};

export const useGetAllGroupEvents = (
  past: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAllGroupEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAllGroupEvents>>
  >(
    ALL_GROUP_EVENTS(past),
    (params: InfiniteQueryParams) => GetAllGroupEvents({ past, ...params }),
    params,
    options
  );
};
