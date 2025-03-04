import type { BaseEvent, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "./useGetEvents";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENTS_FEATURED_QUERY_KEY = (): QueryKey => [
  ...EVENTS_QUERY_KEY(),
  "FEATURED",
];

export const SET_EVENTS_FEATURED_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENTS_FEATURED_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetFeaturedEvents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENTS_FEATURED_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetFeaturedEventsProps extends InfiniteQueryParams {}

export const GetFeaturedEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  clientApiParams,
}: GetFeaturedEventsProps): Promise<ConnectedXMResponse<BaseEvent[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/featured`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
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
