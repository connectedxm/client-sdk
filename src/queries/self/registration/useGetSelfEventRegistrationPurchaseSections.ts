import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY = (
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
  "SECTIONS",
];

export const SET_SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSections>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPurchaseSectionsProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetSelfEventRegistrationPurchaseSections = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
}: GetSelfEventRegistrationPurchaseSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/cart/purchases/${purchaseId}`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationPurchaseSections = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSections>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSections>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPurchaseSections({
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
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        (options?.enabled ?? true),
    }
  );
};
