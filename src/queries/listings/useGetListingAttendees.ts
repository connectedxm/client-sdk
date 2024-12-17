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

export const LISTING_ATTENDEES_QUERY_KEY = (
  eventId: string,
  status?: keyof typeof PurchaseStatus
) => [...LISTING_QUERY_KEY(eventId), "ATTENDEES", status ?? "ALL"];

export interface GetSelfEventListingAttendeesProps extends InfiniteQueryParams {
  eventId: string;
  status?: keyof typeof PurchaseStatus;
}

export const GetSelfEventListingAttendees = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  clientApiParams,
}: GetSelfEventListingAttendeesProps): Promise<
  ConnectedXMResponse<ListingRegistration[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/attendees`, {
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
    Awaited<ReturnType<typeof GetSelfEventListingAttendees>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingAttendees>>
  >(
    LISTING_ATTENDEES_QUERY_KEY(eventId, status),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingAttendees({ eventId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
