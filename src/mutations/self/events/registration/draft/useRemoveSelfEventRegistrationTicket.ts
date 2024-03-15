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

export interface RemoveSelfEventRegistrationTicketParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  ticketId: string;
}

export const RemoveSelfEventRegistrationTicket = async ({
  eventId,
  registrationId,
  ticketId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventRegistrationTicketParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/ticket/${ticketId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(
        eventId,
        registrationId
      ),
    });
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
  }
  return data;
};

export const useRemoveSelfEventRegistrationTicket = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventRegistrationTicket>>,
      Omit<
        RemoveSelfEventRegistrationTicketParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventRegistrationTicketParams,
    Awaited<ReturnType<typeof RemoveSelfEventRegistrationTicket>>
  >(RemoveSelfEventRegistrationTicket, options);
};
