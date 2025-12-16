import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { BOOKING_PLACE_QUERY_KEY } from "./useGetBookingPlace";
import { ConnectedXMResponse, BookingPlaceSpace } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKING_PLACE_SPACES_QUERY_KEY = (bookingId: string): QueryKey => [
  ...BOOKING_PLACE_QUERY_KEY(bookingId),
  "SPACES",
];

export const SET_BOOKING_PLACE_SPACES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PLACE_SPACES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlaceSpaces>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...BOOKING_PLACE_SPACES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetBookingPlaceSpacesProps extends InfiniteQueryParams {
  bookingId: string;
}

export const GetBookingPlaceSpaces = async ({
  bookingId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetBookingPlaceSpacesProps): Promise<
  ConnectedXMResponse<BookingPlaceSpace[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/bookings/places/${bookingId}/spaces`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetBookingPlaceSpaces = (
  bookingId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingPlaceSpaces>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingPlaceSpaces>>
  >(
    BOOKING_PLACE_SPACES_QUERY_KEY(bookingId),
    (params: InfiniteQueryParams) =>
      GetBookingPlaceSpaces({ bookingId, ...params }),
    params,
    {
      ...options,
      enabled: !!bookingId && (options?.enabled ?? true),
    }
  );
};
