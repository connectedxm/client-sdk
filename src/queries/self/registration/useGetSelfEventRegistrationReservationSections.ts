import { ConnectedXMResponse, EventReservationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";

export const SELF_EVENT_REGISTRATION_RESERVATION_SECTIONS_QUERY_KEY = (
  eventId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  "RESERVATION_SECTIONS",
];

export const SET_SELF_EVENT_REGISTRATION_RESERVATION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_REGISTRATION_RESERVATION_SECTIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventRegistrationPurchaseReservationSections>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_RESERVATION_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPurchaseReservationSectionsProps
  extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventRegistrationPurchaseReservationSections = async ({
  eventId,
  clientApiParams,
}: GetSelfEventRegistrationPurchaseReservationSectionsProps): Promise<
  ConnectedXMResponse<EventReservationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/reservationSections`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationPurchaseReservationSections = (
  eventId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPurchaseReservationSections>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPurchaseReservationSections>
  >(
    SELF_EVENT_REGISTRATION_RESERVATION_SECTIONS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPurchaseReservationSections({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
