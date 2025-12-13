import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { Booking, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { BOOKINGS_QUERY_KEY } from "@src/queries";
import { BookingDraftInputs } from "@src/params";

/**
 * @category Params
 * @group Bookings
 */
export interface DraftBookingParams extends MutationParams {
  placeId: string;
  spaceId: string;
  booking: BookingDraftInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DraftBooking = async ({
  placeId,
  spaceId,
  booking,
  queryClient,
  clientApiParams,
}: DraftBookingParams): Promise<ConnectedXMResponse<Booking>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Booking>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/slots`,
    booking
  );

  if (data.status === "ok" && queryClient) {
    queryClient.invalidateQueries({
      queryKey: BOOKINGS_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDraftBooking = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DraftBooking>>,
      Omit<DraftBookingParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DraftBookingParams,
    Awaited<ReturnType<typeof DraftBooking>>
  >(DraftBooking, options);
};
