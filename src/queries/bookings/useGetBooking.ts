import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Booking, ConnectedXMResponse } from "@interfaces";
import { BOOKINGS_QUERY_KEY } from "./useGetBookings";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKING_QUERY_KEY = (bookingId: string): QueryKey => [
  ...BOOKINGS_QUERY_KEY(),
  bookingId,
];

export const SET_BOOKING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBooking>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...BOOKING_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetBookingProps extends SingleQueryParams {
  bookingId: string;
}

export const GetBooking = async ({
  bookingId,
  clientApiParams,
}: GetBookingProps): Promise<ConnectedXMResponse<Booking>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/bookings/${bookingId}`);
  return data;
};

export const useGetBooking = (
  bookingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBooking>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBooking>>(
    BOOKING_QUERY_KEY(bookingId),
    (_params) => GetBooking({ bookingId, ..._params }),
    {
      ...options,
      enabled: !!bookingId && (options?.enabled ?? true),
    }
  );
};
