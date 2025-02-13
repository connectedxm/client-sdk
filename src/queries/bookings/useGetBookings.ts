import { Booking } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { BOOKING_QUERY_KEY } from "./useGetBooking";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKINGS_QUERY_KEY = (): QueryKey => ["BOOKINGS"];

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

export interface GetBookingsParams extends InfiniteQueryParams {}

export const GetBookings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
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
    },
  });
  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (bookingId) => BOOKING_QUERY_KEY(bookingId),
      locale
    );
  }
  return data;
};

export const useGetBookings = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetBookings>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetBookings>>>(
    BOOKINGS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetBookings({ ...params }),
    params,
    options
  );
};
