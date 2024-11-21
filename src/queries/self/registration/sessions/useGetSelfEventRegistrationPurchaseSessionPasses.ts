import { ConnectedXMResponse, SessionPass } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "../useGetSelfEventRegistrationPurchase";

export const SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
): QueryKey => {
  const key = [
    ...SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    "SESSIONS",
  ];
  return key;
};

export const SET_SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSessions>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPurchaseSessionsProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetSelfEventRegistrationPurchaseSessions = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
}: GetSelfEventRegistrationPurchaseSessionsProps): Promise<
  ConnectedXMResponse<SessionPass[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}/sessions`
  );

  return data;
};

export const useGetSelfEventRegistrationPurchaseSessions = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSessions>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSessions>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPurchaseSessions({
        eventId,
        registrationId,
        purchaseId,
        ...params,
      }),
    {
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
