import {
  ConnectedXMResponse,
  EventAddOn,
  EventReservationSection,
} from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_EVENT_REGISTRATION_PURCHASE_RESERVATION_SECTIONS_QUERY_KEY = (
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
  "RESERVATIONS",
];

export const SET_SELF_EVENT_REGISTRATION_PURCHASE_RESERVATION_SECTIONS_QUERY_DATA =
  (
    client: QueryClient,
    keyParams: Parameters<
      typeof SELF_EVENT_REGISTRATION_PURCHASE_RESERVATION_SECTIONS_QUERY_KEY
    >,
    response: Awaited<
      ReturnType<typeof GetSelfEventRegistrationPurchaseReservationSections>
    >,
    baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
  ) => {
    client.setQueryData(
      [
        ...SELF_EVENT_REGISTRATION_PURCHASE_RESERVATION_SECTIONS_QUERY_KEY(
          ...keyParams
        ),
        ...GetBaseSingleQueryKeys(...baseKeys),
      ],
      response
    );
  };

export interface GetSelfEventRegistrationPurchaseReservationSectionsProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetSelfEventRegistrationPurchaseReservationSections = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
}: GetSelfEventRegistrationPurchaseReservationSectionsProps): Promise<
  ConnectedXMResponse<EventReservationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/draft/purchases/${purchaseId}/reservationSections`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationPurchaseReservationSections = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPurchaseReservationSections>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPurchaseReservationSections>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_RESERVATION_SECTIONS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPurchaseReservationSections({
        eventId,
        registrationId,
        purchaseId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        (options?.enabled ?? true),
    }
  );
};
