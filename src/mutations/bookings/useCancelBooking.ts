import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Booking, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { BOOKINGS_QUERY_KEY } from "@src/queries/bookings/useGetBookings";
import { BOOKING_QUERY_KEY } from "@src/queries/bookings/useGetBooking";

/**
 * @category Params
 * @group Bookings
 */
export interface CancelBookingParams extends MutationParams {
  bookingId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CancelBooking = async ({
  bookingId,
  clientApiParams,
  queryClient,
}: CancelBookingParams): Promise<ConnectedXMResponse<Booking>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Booking>>(
    `/bookings/${bookingId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(BOOKING_QUERY_KEY(bookingId), data);
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
export const useCancelBooking = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelBooking>>,
      Omit<CancelBookingParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelBookingParams,
    Awaited<ReturnType<typeof CancelBooking>>
  >(CancelBooking, options);
};
