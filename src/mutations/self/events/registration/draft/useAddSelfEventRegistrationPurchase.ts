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

export interface AddSelfEventRegistrationPurchaseParams extends MutationParams {
  eventId: string;
  registrationId: string;
  ticketId: string;
  quantity: number;
}

export const AddSelfEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  ticketId,
  quantity,
  clientApiParams,
  queryClient,
}: AddSelfEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/purchases`,
    {
      ticketId,
      quantity,
    }
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
    queryClient.invalidateQueries({ queryKey: SELF_EVENTS_QUERY_KEY(false) });
    queryClient.invalidateQueries({ queryKey: SELF_EVENTS_QUERY_KEY(true) });
    queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRANTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useAddSelfEventRegistrationPurchase = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfEventRegistrationPurchase>>,
      Omit<
        AddSelfEventRegistrationPurchaseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfEventRegistrationPurchaseParams,
    Awaited<ReturnType<typeof AddSelfEventRegistrationPurchase>>
  >(AddSelfEventRegistrationPurchase, options);
};
