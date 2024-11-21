import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "../useGetSelfEventRegistration";

export const SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_KEY = (
  eventId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  "SESSIONS_INTENT",
];

export const SET_SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationSessionsIntent>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationSessionsIntentProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
}

export const GetSelfEventRegistrationSessionsIntent = async ({
  eventId,
  registrationId,
  clientApiParams,
}: GetSelfEventRegistrationSessionsIntentProps): Promise<
  ConnectedXMResponse<PaymentIntent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/sessions/intent`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationSessionsIntent = (
  eventId: string,
  registrationId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationSessionsIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationSessionsIntent>
  >(
    SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationSessionsIntent({
        eventId,
        registrationId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        (options?.enabled ?? true),
    }
  );
};
