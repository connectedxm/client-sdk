import type { ConnectedXMResponse, EventListing } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "../self/useGetSelf";
import { LISTING_QUERY_KEY } from "./useGetListing";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const LISTINGS_QUERY_KEY = (past: boolean): QueryKey => [
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
    LISTINGS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetSelfEventListings({ past, ...params }),
    params,
    {
      ...options,
      enabled: options?.enabled ?? true,
    }
  );
};
