import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  LISTING_PURCHASES_QUERY_KEY,
  LISTING_PURCHASE_QUERY_KEY,
  LISTING_REGISTRATIONS_QUERY_KEY,
  LISTING_REGISTRATION_QUERY_KEY,
  LISTING_REPORT_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingRegistrationPurchaseSections";

export interface UpdateListingRegistrationPurchaseResponsesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questions: {
    id: number;
    value: string;
  }[];
}

export const UpdateListingRegistrationPurchaseResponses = async ({
  eventId,
  registrationId,
  purchaseId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateListingRegistrationPurchaseResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/listings/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`,
    {
      questions,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
    });
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
    queryClient.invalidateQueries({
      queryKey: LISTING_REPORT_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useUpdateListingRegistrationPurchaseResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateListingRegistrationPurchaseResponses>>,
      Omit<
        UpdateListingRegistrationPurchaseResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateListingRegistrationPurchaseResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateListingRegistrationPurchaseResponses, options);
};
