import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  LISTING_PURCHASES_QUERY_KEY,
  LISTING_PURCHASE_QUERY_KEY,
  LISTING_REGISTRATIONS_QUERY_KEY,
  LISTING_REGISTRATION_QUERY_KEY,
} from "@src/queries";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";

export interface UndoCheckinListingRegistrationPurchaseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const UndoCheckinListingRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
  queryClient,
}: UndoCheckinListingRegistrationPurchaseParams): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Purchase>>(
    `/listings/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_REGISTRATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_REGISTRATION_QUERY_KEY(eventId, registrationId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_PURCHASES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_PURCHASE_QUERY_KEY(eventId, purchaseId),
    });
  }

  return data;
};

export const useUndoCheckinListingRegistrationPurchase = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UndoCheckinListingRegistrationPurchase>>,
      Omit<
        UndoCheckinListingRegistrationPurchaseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UndoCheckinListingRegistrationPurchaseParams,
    Awaited<ReturnType<typeof UndoCheckinListingRegistrationPurchase>>
  >(UndoCheckinListingRegistrationPurchase, options);
};
