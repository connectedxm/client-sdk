import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface SelectSelfEventRegistrationPurchaseReservationParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  locationId: string;
}

export const SelectSelfEventRegistrationPurchaseReservation = async ({
  eventId,
  registrationId,
  purchaseId,
  locationId,
  clientApiParams,
  queryClient,
}: SelectSelfEventRegistrationPurchaseReservationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/purchases/${purchaseId}/reservations/${locationId}`
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(
        eventId,
        registrationId
      ),
    });
  }

  return data;
};

export const useSelectSelfEventRegistrationPurchaseReservation = (
  options: Omit<
    MutationOptions<
      Awaited<
        ReturnType<typeof SelectSelfEventRegistrationPurchaseReservation>
      >,
      Omit<
        SelectSelfEventRegistrationPurchaseReservationParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelectSelfEventRegistrationPurchaseReservationParams,
    Awaited<ReturnType<typeof SelectSelfEventRegistrationPurchaseReservation>>
  >(SelectSelfEventRegistrationPurchaseReservation, options);
};