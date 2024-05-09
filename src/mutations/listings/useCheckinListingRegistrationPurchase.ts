import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  LISTING_REGISTRATIONS_QUERY_KEY,
  LISTING_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface CheckinListingRegistrationPurchaseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const CheckinListingRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
  queryClient,
}: CheckinListingRegistrationPurchaseParams) => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/listings/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_REGISTRATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_REGISTRATION_QUERY_KEY(eventId, registrationId),
    });
  }

  return data;
};

export const useCheckinListingRegistrationPurchase = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CheckinListingRegistrationPurchase>>,
      Omit<
        CheckinListingRegistrationPurchaseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckinListingRegistrationPurchaseParams,
    Awaited<ReturnType<typeof CheckinListingRegistrationPurchase>>
  >(CheckinListingRegistrationPurchase, options);
};
