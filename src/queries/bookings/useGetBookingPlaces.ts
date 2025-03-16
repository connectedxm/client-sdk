import { BookingPlace } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKING_PLACES_QUERY_KEY = (): QueryKey => ["BOOKING_PLACES"];

export interface GetBookingPlacesParams extends InfiniteQueryParams {}

export const GetBookingPlaces = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetBookingPlacesParams): Promise<ConnectedXMResponse<BookingPlace[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/bookings/places`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetBookingPlaces = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingPlaces>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingPlaces>>
  >(
    BOOKING_PLACES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetBookingPlaces({ ...params }),
    params,
    options
  );
};
