import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface DraftBookingParams extends MutationParams {
  placeId: string;
  spaceId: string;
  start: string;
}

export const DraftBooking = async ({
  placeId,
  spaceId,
  start,
  clientApiParams,
}: DraftBookingParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/bookings/places/${placeId}/spaces/${spaceId}/slots`,
    { start }
  );

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
