import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_REGISTRATION_QUERY_KEY } from "./useGetListingRegistration";

export const LISTING_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
): QueryKey => [
  ...LISTING_REGISTRATION_QUERY_KEY(eventId, registrationId),
  purchaseId,
  "SECTIONS",
];

export const SET_LISTING_REGISTRATION_PURCHASE_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof LISTING_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetListingRegistrationPurchaseSections>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LISTING_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetListingRegistrationPurchaseSectionsProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetListingRegistrationPurchaseSections = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
}: GetListingRegistrationPurchaseSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`,
    {}
  );

  return data;
};

export const useGetListingRegistrationPurchaseSections = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetListingRegistrationPurchaseSections>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetListingRegistrationPurchaseSections>
  >(
    LISTING_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: SingleQueryParams) =>
      GetListingRegistrationPurchaseSections({
        eventId,
        registrationId,
        purchaseId,
        ...params,
      }),
    {
      retry: false,
      ...options,
      enabled:
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        (options?.enabled ?? true),
    }
  );
};
