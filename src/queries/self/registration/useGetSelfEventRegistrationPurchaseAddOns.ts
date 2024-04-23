import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENT",
  eventId,
  "REGISTRATION",
  registrationId,
  "PURCHASE",
  purchaseId,
  "ADD_ONS",
];

export const SET_SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationPurchaseAddOns>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPurchaseAddOnsProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetSelfEventRegistrationPurchaseAddOns = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
}: GetSelfEventRegistrationPurchaseAddOnsProps): Promise<
  ConnectedXMResponse<EventAddOn[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/draft/purchases/${purchaseId}/addOns`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationPurchaseAddOns = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPurchaseAddOns>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPurchaseAddOns>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPurchaseAddOns({
        eventId,
        registrationId,
        purchaseId,
        ...params,
      }),
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      ...options,
      enabled:
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        (options?.enabled ?? true),
    }
  );
};
