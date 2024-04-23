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

export interface RemoveSelfEventRegistrationPurchaseAddOnParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  addOnId: string;
}

export const RemoveSelfEventRegistrationPurchaseAddOn = async ({
  eventId,
  registrationId,
  purchaseId,
  addOnId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventRegistrationPurchaseAddOnParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/purchases/${purchaseId}/addOns/${addOnId}`
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

export const useRemoveSelfEventRegistrationPurchaseAddOn = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventRegistrationPurchaseAddOn>>,
      Omit<
        RemoveSelfEventRegistrationPurchaseAddOnParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventRegistrationPurchaseAddOnParams,
    Awaited<ReturnType<typeof RemoveSelfEventRegistrationPurchaseAddOn>>
  >(RemoveSelfEventRegistrationPurchaseAddOn, options);
};
