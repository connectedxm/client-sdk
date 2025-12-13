import type { Account, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { LISTING_QUERY_KEY } from "./useGetListing";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const LISTING_CO_HOSTS_QUERY_KEY = (eventId: string): QueryKey => [
  ...LISTING_QUERY_KEY(eventId),
  "CO_HOSTS",
];

export interface GetSelfEventListingCoHostsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventListingCoHosts = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfEventListingCoHostsProps): Promise<
  ConnectedXMResponse<Account[]>
> => {
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

export const useGetSelfEventListingCoHosts = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingCoHosts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingCoHosts>>
  >(
    LISTING_CO_HOSTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingCoHosts({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
