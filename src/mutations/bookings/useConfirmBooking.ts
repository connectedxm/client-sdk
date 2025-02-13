import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { BOOKINGS_QUERY_KEY } from "@src/queries/bookings/useGetBookings";
import { BOOKING_QUERY_KEY } from "@src/queries/bookings/useGetBooking";

export interface ConfirmBookingParams extends MutationParams {
  bookingId: string;
}

export const ConfirmBooking = async ({
  bookingId,
  clientApiParams,
  queryClient,
}: ConfirmBookingParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
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

export const useConfirmBooking = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ConfirmBooking>>,
      Omit<ConfirmBookingParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ConfirmBookingParams,
    Awaited<ReturnType<typeof ConfirmBooking>>
  >(ConfirmBooking, options);
};
