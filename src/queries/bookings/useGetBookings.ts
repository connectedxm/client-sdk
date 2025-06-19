import { Booking } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { BOOKING_QUERY_KEY } from "./useGetBooking";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKINGS_QUERY_KEY = (
  past?: boolean,
  placeId?: string
): QueryKey => {
  const keys = ["BOOKINGS"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  if (placeId) {
    keys.push(placeId);
  }
  return keys;
};

export const SET_BOOKINGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKINGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookings>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...BOOKINGS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetBookingsParams extends InfiniteQueryParams {
  past?: boolean;
  placeId?: string;
}

export const GetBookings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  placeId,
  queryClient,
  clientApiParams,
  locale,
}: GetBookingsParams): Promise<ConnectedXMResponse<Booking[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/bookings`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past !== undefined ? past : undefined,
      placeId: placeId || undefined,
    },
  });return data;
};

export const useGetBookings = (
  past: boolean = false,
  placeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetBookings>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetBookings>>>(
    BOOKINGS_QUERY_KEY(past, placeId),
    (params: InfiniteQueryParams) => GetBookings({ past, placeId, ...params }),
    params,
    options
  );
};
