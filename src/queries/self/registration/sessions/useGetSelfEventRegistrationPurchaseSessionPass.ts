import { ConnectedXMResponse, SessionPass } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY } from "./useGetSelfEventRegistrationPurchaseSessionPasses";

export const SELF_EVENT_REGISTRATION_PURCHASE_SESSION_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  sessionPassId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY(
    eventId,
    registrationId,
    purchaseId
  ),
  sessionPassId,
];

export const SET_SELF_EVENT_REGISTRATION_PURCHASE_SESSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_REGISTRATION_PURCHASE_SESSION_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSessionPass>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_PURCHASE_SESSION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPurchaseSessionPassProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  sessionPassId: string;
}

export const GetSelfEventRegistrationPurchaseSessionPass = async ({
  eventId,
  registrationId,
  purchaseId,
  sessionPassId,
  clientApiParams,
}: GetSelfEventRegistrationPurchaseSessionPassProps): Promise<
  ConnectedXMResponse<SessionPass>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}/sessions/${sessionPassId}`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationPurchaseSessionPass = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  sessionPassId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSessionPass>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPurchaseSessionPass>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_SESSION_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId,
      sessionPassId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPurchaseSessionPass({
        eventId,
        registrationId,
        purchaseId,
        sessionPassId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        !!sessionPassId &&
        (options?.enabled ?? true),
    }
  );
};
