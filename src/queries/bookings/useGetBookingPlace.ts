import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { BookingPlace, ConnectedXMResponse } from "@interfaces";
import { BOOKING_PLACES_QUERY_KEY } from "./useGetBookingPlaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKING_PLACE_QUERY_KEY = (placeId: string): QueryKey => [
  ...BOOKING_PLACES_QUERY_KEY(),
  placeId,
];

export const SET_BOOKING_PLACE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PLACE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlace>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...BOOKING_PLACE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

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
