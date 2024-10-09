import type {
  ConnectedXMResponse,
  ListingRegistration,
  PurchaseStatus,
} from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { LISTING_QUERY_KEY } from "./useGetListing";
import { GetClientAPI } from "@src/ClientAPI";

export const LISTING_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  status?: keyof typeof PurchaseStatus
) => [...LISTING_QUERY_KEY(eventId), "REGISTRATIONS", status ?? "ALL"];

export interface GetSelfEventListingRegistrationsProps
  extends InfiniteQueryParams {
  eventId: string;
  status?: keyof typeof PurchaseStatus;
}

export const GetSelfEventListingRegistrations = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  clientApiParams,
}: GetSelfEventListingRegistrationsProps): Promise<
  ConnectedXMResponse<ListingRegistration[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/registrations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};

export const useGetSelfEventListingsRegistrations = (
  eventId: string,
  status?: keyof typeof PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingRegistrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingRegistrations>>
  >(
    LISTING_REGISTRATIONS_QUERY_KEY(eventId, status),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingRegistrations({ eventId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
