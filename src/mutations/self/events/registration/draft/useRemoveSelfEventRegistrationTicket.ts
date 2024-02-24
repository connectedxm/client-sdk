import { GetClientAPI } from "@src/ClientAPI";
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

export interface RemoveSelfEventRegistrationTicketParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const RemoveSelfEventRegistrationTicket = async ({
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
  locale = "en",
}: RemoveSelfEventRegistrationTicketParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/ticket`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(
        eventId,
        registrationId
      ),
    });
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);

    queryClient.invalidateQueries({
      queryKey: SELF_EVENTS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENTS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRANTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useRemoveSelfEventRegistrationTicket = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
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
  >(RemoveSelfEventRegistrationTicket, params, options);
};
