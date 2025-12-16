import type { Account, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_LISTING_QUERY_KEY } from "../useGetEventListing";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_LISTING_CO_HOSTS_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_LISTING_QUERY_KEY(eventId),
  "CO_HOSTS",
];

export interface GetEventListingCoHostsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventListingCoHosts = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventListingCoHostsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/coHosts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetEventListingCoHosts = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventListingCoHosts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventListingCoHosts>>
  >(
    EVENT_LISTING_CO_HOSTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventListingCoHosts({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
