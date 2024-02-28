import type { ConnectedXMResponse, EventListing } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { SELF_EVENT_LISTING_QUERY_KEY } from "./useGetSelfEventListing";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_EVENT_LISTINGS_QUERY_KEY = (past: boolean): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENT_LISTINGS",
  past ? "PAST" : "UPCOMING",
];

export interface GetSelfEventListingsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetSelfEventListings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  queryClient,
  clientApiParams,
  locale,
}: GetSelfEventListingsProps): Promise<ConnectedXMResponse<EventListing[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/listings`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: typeof past == "boolean" ? past : undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (eventId) => SELF_EVENT_LISTING_QUERY_KEY(eventId),
      locale
    );
  }

  return data;
};

export const useGetSelfEventListings = (
  past: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListings>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListings>>
  >(
    SELF_EVENT_LISTINGS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetSelfEventListings({ past, ...params }),
    params,
    {
      ...options,
      enabled: options.enabled ?? true,
    }
  );
};
