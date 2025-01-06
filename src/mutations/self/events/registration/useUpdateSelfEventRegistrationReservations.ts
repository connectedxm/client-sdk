import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUESTIONS_QUERY_KEY,
} from "@src/queries";

export interface UpdateSelfEventRegistrationReservationsParams
  extends MutationParams {
  eventId: string;
  passes: {
    id: string;
    reservation: {
      id: string;
      eventRoomTypeId: string;
      start?: Date | string;
      end?: Date | string;
    };
  }[];
}

export const UpdateSelfEventRegistrationReservations = async ({
  eventId,
  passes,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationReservationsParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/reservations`,
    passes
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUESTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

export const useUpdateSelfEventRegistrationReservations = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationReservations>>,
      Omit<
        UpdateSelfEventRegistrationReservationsParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationReservationsParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationReservations>>
  >(UpdateSelfEventRegistrationReservations, options);
};
