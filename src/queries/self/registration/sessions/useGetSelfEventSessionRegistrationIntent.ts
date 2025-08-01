import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY } from "./useGetSelfEventSessionRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  addressId?: string
) => {
  const key = [
    ...SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
    "INTENT",
  ];
  if (addressId) {
    key.push(addressId);
  }
  return key;
};

export interface GetSelfEventSessionRegistrationIntentProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  addressId: string;
}

export const GetSelfEventSessionRegistrationIntent = async ({
  eventId,
  sessionId,
  addressId,
  clientApiParams,
}: GetSelfEventSessionRegistrationIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/sessions/${sessionId}/registration/intent`,
    {
      params: {
        addressId,
      },
    }
  );
  return data;
};

export const useGetSelfEventSessionRegistrationIntent = (
  eventId: string = "",
  sessionId: string = "",
  addressId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventSessionRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventSessionRegistrationIntent>
  >(
    SELF_EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY(eventId, addressId),
    (params) =>
      GetSelfEventSessionRegistrationIntent({
        eventId,
        sessionId,
        addressId,
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
        !!sessionId &&
        !!addressId &&
        (options?.enabled ?? true),
    }
  );
};
