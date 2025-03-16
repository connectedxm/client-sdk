import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { BookingPlace, ConnectedXMResponse } from "@interfaces";
import { BOOKING_PLACES_QUERY_KEY } from "./useGetBookingPlaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKING_PLACE_QUERY_KEY = (placeId: string): QueryKey => [
  ...BOOKING_PLACES_QUERY_KEY(),
  placeId,
];

export interface GetBookingPlaceProps extends SingleQueryParams {
  placeId: string;
}

export const GetBookingPlace = async ({
  placeId,
  clientApiParams,
}: GetBookingPlaceProps): Promise<ConnectedXMResponse<BookingPlace>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/bookings/places/${placeId}`);
  return data;
};

export const useGetBookingPlace = (
  placeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingPlace>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingPlace>>(
    BOOKING_PLACE_QUERY_KEY(placeId),
    (_params) => GetBookingPlace({ placeId, ..._params }),
    {
      ...options,
      enabled: !!placeId && (options?.enabled ?? true),
    }
  );
};
