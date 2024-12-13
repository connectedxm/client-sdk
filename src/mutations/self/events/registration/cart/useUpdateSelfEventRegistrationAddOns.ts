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
  SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface UpdateSelfEventRegistrationPurchaseAddOnParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  passes: {
    passId: string;
    addOnIds: string[];
  }[];
}

export const UpdateSelfEventRegistrationPurchaseAddOn = async ({
  eventId,
  registrationId,
  passes,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationPurchaseAddOnParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/cart/purchases/addOns`,
    passes
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

    // TODO: Do something to invalidate registration section queries.
    // This will cause a bug when the user selects add ons, moves on to questions, changes their add ons, and goes back to questions.
    // queryClient.removeQueries({
    //   queryKey: SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
    //     eventId,
    //     registrationId,
    //     purchaseId
    //   ),
    // });
    queryClient.invalidateQueries({ queryKey: SELF_EVENTS_QUERY_KEY(false) });
    queryClient.invalidateQueries({ queryKey: SELF_EVENTS_QUERY_KEY(true) });
    queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRANTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useUpdateSelfEventRegistrationPurchaseAddOn = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationPurchaseAddOn>>,
      Omit<
        UpdateSelfEventRegistrationPurchaseAddOnParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationPurchaseAddOnParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationPurchaseAddOn>>
  >(UpdateSelfEventRegistrationPurchaseAddOn, options);
};
