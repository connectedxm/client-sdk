import { Booking, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { BOOKINGS_QUERY_KEY } from "@src/queries/bookings/useGetBookings";
import { BOOKING_QUERY_KEY } from "@src/queries/bookings/useGetBooking";

export interface UpdateBookingResponsesParams extends MutationParams {
  bookingId: string;
  responses?: { questionId: string; value: string }[];
}

export const UpdateBookingResponses = async ({
  bookingId,
  responses = [],
  clientApiParams,
  queryClient,
}: UpdateBookingResponsesParams): Promise<ConnectedXMResponse<Booking>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Booking>>(
    `/bookings/${bookingId}/responses`,
    { responses }
  );

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(BOOKING_QUERY_KEY(bookingId), data);
    queryClient.invalidateQueries({
      queryKey: BOOKINGS_QUERY_KEY(),
    });
  }

  return data;
};

export const useUpdateBookingResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateBookingResponses>>,
      Omit<UpdateBookingResponsesParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateBookingResponsesParams,
    Awaited<ReturnType<typeof UpdateBookingResponses>>
  >(UpdateBookingResponses, options);
};
