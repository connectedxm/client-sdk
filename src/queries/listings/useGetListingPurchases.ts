import type { ConnectedXMResponse, ListingPurchase } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { LISTING_QUERY_KEY } from "./useGetListing";
import { GetClientAPI } from "@src/ClientAPI";

export const LISTING_PURCHASES_QUERY_KEY = (
  eventId: string,
  checkedIn?: boolean
) => [
  ...LISTING_QUERY_KEY(eventId),
  "PURCHASES",
  typeof checkedIn !== "undefined" ? checkedIn : "ALL",
];

export interface GetSelfEventListingPurchasesProps extends InfiniteQueryParams {
  eventId: string;
  checkedIn?: boolean;
}

export const GetSelfEventListingPurchases = async ({
  eventId,
  checkedIn,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfEventListingPurchasesProps): Promise<
  ConnectedXMResponse<ListingPurchase[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/purchases`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      checkedIn,
    },
  });
  return data;
};

export const useGetSelfEventListingPurchases = (
  eventId: string,
  checkedIn?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingPurchases>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingPurchases>>
  >(
    LISTING_PURCHASES_QUERY_KEY(eventId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingPurchases({ eventId, checkedIn, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
