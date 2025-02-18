import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { BOOKING_QUERY_KEY } from "@src/queries/bookings/useGetBooking";

export interface DeleteDraftBookingParams extends MutationParams {
  bookingId: string;
}

export const DeleteDraftBooking = async ({
  bookingId,
  clientApiParams,
  queryClient,
}: DeleteDraftBookingParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/bookings/${bookingId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({ queryKey: BOOKING_QUERY_KEY(bookingId) });
  }

  return data;
};

export const useDeleteDraftBooking = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteDraftBooking>>,
      Omit<DeleteDraftBookingParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteDraftBookingParams,
    Awaited<ReturnType<typeof DeleteDraftBooking>>
  >(DeleteDraftBooking, options);
};
