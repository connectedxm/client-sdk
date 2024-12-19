import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries";

export interface SelectSelfEventRegistrationReservationsParams
  extends MutationParams {
  eventId: string;
  passes: {
    id: string;
    reservationSectionLocationId: string;
    reservationStart?: string;
    reservationEnd?: string;
  }[];
}

export const SelectSelfEventRegistrationReservations = async ({
  eventId,
  passes,
  clientApiParams,
  queryClient,
}: SelectSelfEventRegistrationReservationsParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/passes/reservations`,
    passes
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
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
