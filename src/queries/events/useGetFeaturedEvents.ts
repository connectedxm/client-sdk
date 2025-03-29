import type { BaseEvent, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "./useGetEvents";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENTS_FEATURED_QUERY_KEY = (): QueryKey => [
  ...EVENTS_QUERY_KEY(),
  "FEATURED",
];

export interface GetFeaturedEventsProps extends InfiniteQueryParams {}

export const GetFeaturedEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetFeaturedEventsProps): Promise<ConnectedXMResponse<BaseEvent[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/featured`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetFeaturedEvents = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetFeaturedEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetFeaturedEvents>>
  >(
    EVENTS_FEATURED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetFeaturedEvents({ ...params }),
    params,
    options
  );
};
