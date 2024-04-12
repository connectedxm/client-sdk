import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY,
  SET_SELF_EVENT_LISTING_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface SelfCheckinRegistrationPurchaseParams extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const SelfCheckinRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
  queryClient,
}: SelfCheckinRegistrationPurchaseParams) => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/self/events/listings/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId),
    });
    SET_SELF_EVENT_LISTING_REGISTRATION_QUERY_DATA(
      queryClient,
      [eventId, registrationId],
      data
    );
  }
  return data;
};

export const useSelfCheckinRegistrationPurchase = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfCheckinRegistrationPurchase>>,
      Omit<
        SelfCheckinRegistrationPurchaseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfCheckinRegistrationPurchaseParams,
    Awaited<ReturnType<typeof SelfCheckinRegistrationPurchase>>
  >(SelfCheckinRegistrationPurchase, options);
};
