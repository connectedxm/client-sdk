import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { BookingSpace, ConnectedXMResponse } from "@interfaces";
import { BOOKING_PLACES_QUERY_KEY } from "./useGetBookingPlaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKING_PLACE_SPACE_QUERY_KEY = (
  placeId: string,
  spaceId: string
): QueryKey => [...BOOKING_PLACES_QUERY_KEY(), placeId, "SPACE", spaceId];

export interface GetBookingPlaceSpaceProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
}

export const GetBookingPlaceSpace = async ({
  placeId,
  spaceId,
  clientApiParams,
}: GetBookingPlaceSpaceProps): Promise<ConnectedXMResponse<BookingSpace>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}`
  );
  return data;
};

export const useGetBookingPlaceSpace = (
  placeId: string = "",
  spaceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingPlaceSpace>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingPlaceSpace>>(
    BOOKING_PLACE_SPACE_QUERY_KEY(placeId, spaceId),
    (_params) => GetBookingPlaceSpace({ placeId, spaceId, ..._params }),
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options?.enabled ?? true),
    }
  );
};
