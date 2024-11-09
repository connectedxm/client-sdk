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

export interface RemoveSelfEventRegistrationPurchaseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const RemoveSelfEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/cart/purchases/${purchaseId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(
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

export const useRemoveSelfEventRegistrationPurchase = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventRegistrationPurchase>>,
      Omit<
        RemoveSelfEventRegistrationPurchaseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventRegistrationPurchaseParams,
    Awaited<ReturnType<typeof RemoveSelfEventRegistrationPurchase>>
  >(RemoveSelfEventRegistrationPurchase, options);
};
