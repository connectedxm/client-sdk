import type { ConnectedXMResponse, ListingPass } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { LISTING_QUERY_KEY } from "./useGetListing";
import { GetClientAPI } from "@src/ClientAPI";

export const LISTING_PASSES_QUERY_KEY = (
  eventId: string,
  checkedIn?: boolean
) => [
  ...LISTING_QUERY_KEY(eventId),
  "PURCHASES",
  typeof checkedIn !== "undefined" ? checkedIn : "ALL",
];

export interface GetSelfEventListingPassesProps extends InfiniteQueryParams {
  eventId: string;
  checkedIn?: boolean;
}

export const GetSelfEventListingPasses = async ({
  eventId,
  checkedIn,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfEventListingPassesProps): Promise<
  ConnectedXMResponse<ListingPass[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/passes`, {
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

export const useGetSelfEventListingPasses = (
  eventId: string,
  checkedIn?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingPasses>>
  >(
    LISTING_PASSES_QUERY_KEY(eventId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingPasses({ eventId, checkedIn, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
