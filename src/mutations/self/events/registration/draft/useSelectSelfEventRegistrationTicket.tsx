import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUERY_KEY,
  EVENT_REGISTRANTS_QUERY_KEY,
  SELF_EVENTS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface SelectSelfEventRegistrationTicketParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  ticketId: string;
}

export const SelectSelfEventRegistrationTicket = async ({
  eventId,
  registrationId,
  ticketId,
  clientApi,
  queryClient,
  locale = "en",
}: SelectSelfEventRegistrationTicketParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/ticket`,
    {
      ticketId,
      quantity: 1,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(
        eventId,
        registrationId
      ),
    });
    queryClient.invalidateQueries({ queryKey: SELF_EVENTS_QUERY_KEY(false) });
    queryClient.invalidateQueries({ queryKey: SELF_EVENTS_QUERY_KEY(true) });
    queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRANTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useSelectSelfEventRegistrationTicket = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof SelectSelfEventRegistrationTicket>>,
    SelectSelfEventRegistrationTicketParams
  > = {}
) => {
  return useConnectedMutation<
    SelectSelfEventRegistrationTicketParams,
    Awaited<ReturnType<typeof SelectSelfEventRegistrationTicket>>
  >(SelectSelfEventRegistrationTicket, params, options);
};
