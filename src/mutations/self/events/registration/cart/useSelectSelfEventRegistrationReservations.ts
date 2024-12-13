import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface SelectSelfEventRegistrationReservationsParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  reservations: {
    startDate: string;
    endDate: string;
    selections: {
      passId: string;
      reservationSectionLocationId: string;
    }[];
  };
}

export const SelectSelfEventRegistrationReservations = async ({
  eventId,
  registrationId,
  reservations,
  clientApiParams,
  queryClient,
}: SelectSelfEventRegistrationReservationsParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/cart/purchases/reservations`,
    reservations
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(
        eventId,
        registrationId
      ),
    });
  }

  return data;
};

export const useSelectSelfEventRegistrationReservations = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelectSelfEventRegistrationReservations>>,
      Omit<
        SelectSelfEventRegistrationReservationsParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelectSelfEventRegistrationReservationsParams,
    Awaited<ReturnType<typeof SelectSelfEventRegistrationReservations>>
  >(SelectSelfEventRegistrationReservations, options);
};
