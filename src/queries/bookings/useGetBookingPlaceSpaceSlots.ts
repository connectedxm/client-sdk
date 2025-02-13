import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { BookingDaySlots, ConnectedXMResponse } from "@interfaces";
import { BOOKING_PLACES_QUERY_KEY } from "./useGetBookingPlaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKING_PLACE_SPACE_SLOTS_QUERY_KEY = (
  placeId: string,
  spaceId: string
): QueryKey => [
  ...BOOKING_PLACES_QUERY_KEY(),
  placeId,
  "SPACE",
  spaceId,
  "SLOTS",
];

export interface GetBookingPlaceSpaceSlotsProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
}

export const GetBookingPlaceSpaceSlots = async ({
  placeId,
  spaceId,
  clientApiParams,
}: GetBookingPlaceSpaceSlotsProps): Promise<
  ConnectedXMResponse<BookingDaySlots[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/slots`
  );
  return data;
};

export const useGetBookingPlaceSpaceSlots = (
  placeId: string = "",
  spaceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingPlaceSpaceSlots>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingPlaceSpaceSlots>>(
    BOOKING_PLACE_SPACE_SLOTS_QUERY_KEY(placeId, spaceId),
    (_params) => GetBookingPlaceSpaceSlots({ placeId, spaceId, ..._params }),
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options?.enabled ?? true),
    }
  );
};
