import { BookingPlace } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKING_PLACES_QUERY_KEY = (): QueryKey => ["BOOKING_PLACES"];

export const SET_BOOKING_PLACES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PLACES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlaces>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...BOOKING_PLACES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

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
