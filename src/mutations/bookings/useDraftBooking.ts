import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Booking, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { BOOKINGS_QUERY_KEY } from "@src/queries";

export interface DraftBookingParams extends MutationParams {
  placeId: string;
  spaceId: string;
  day: string;
  time: string;
}

export const DraftBooking = async ({
  placeId,
  spaceId,
  day,
  time,
  queryClient,
  clientApiParams,
}: DraftBookingParams): Promise<ConnectedXMResponse<Booking>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Booking>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/slots`,
    { day, time }
  );

  if (data.status === "ok" && queryClient) {
    queryClient.invalidateQueries({
      queryKey: BOOKINGS_QUERY_KEY(),
    });
  }

  return data;
};

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
