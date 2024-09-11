import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "./useGetSelfEventRegistrationPurchase";

export const SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_INTENT_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  addOnIds?: string[]
): QueryKey => {
  const key = [
    ...SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    "ADD_ONS_INTENT",
  ];

  if (addOnIds) {
    key.push(...addOnIds);
  }

  return key;
};

export interface GetSelfEventRegistrationPurchaseAddOnsIntentProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  addOnIds: string[];
}

export const GetSelfEventRegistrationPurchaseAddOnsIntent = async ({
  eventId,
  registrationId,
  purchaseId,
  addOnIds,
  clientApiParams,
}: GetSelfEventRegistrationPurchaseAddOnsIntentProps): Promise<
  ConnectedXMResponse<PaymentIntent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}/addOns/intent`,
    {
      params: {
        addOnIds: addOnIds ? addOnIds.join(",") : "",
      },
    }
  );

  return data;
};

export const useGetSelfEventRegistrationPurchaseAddOnsIntent = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  addOnIds: string[],
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPurchaseAddOnsIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPurchaseAddOnsIntent>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_INTENT_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId,
      addOnIds
    ),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPurchaseAddOnsIntent({
        eventId,
        registrationId,
        purchaseId,
        addOnIds,
        ...params,
      }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        !!addOnIds &&
        (options?.enabled ?? true),
    }
  );
};
