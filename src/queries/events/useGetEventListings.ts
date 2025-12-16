import type { ConnectedXMResponse, EventEvent } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "../self/useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_LISTINGS_QUERY_KEY = (past: boolean): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENT_EVENTS",
  past ? "PAST" : "UPCOMING",
];

export interface GetEventListingsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetEventListings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  clientApiParams,
}: GetEventListingsProps): Promise<ConnectedXMResponse<EventEvent[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: typeof past == "boolean" ? past : undefined,
    },
  });

  return data;
};

export const useGetEventListings = (
  past: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventListings>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventListings>>
  >(
    EVENT_LISTINGS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetEventListings({ past, ...params }),
    params,
    {
      ...options,
      enabled: options?.enabled ?? true,
    }
  );
};

