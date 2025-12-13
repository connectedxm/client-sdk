import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { EVENT_SESSION_REGISTRATION_QUERY_KEY } from "./useGetEventSessionRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  addressId?: string
) => {
  const key = [
    ...EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
    "INTENT",
  ];
  if (addressId) {
    key.push(addressId);
  }
  return key;
};

export interface GetEventSessionRegistrationIntentProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  addressId: string;
}

export const GetEventSessionRegistrationIntent = async ({
  eventId,
  sessionId,
  addressId,
  clientApiParams,
}: GetEventSessionRegistrationIntentProps): Promise<
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

export const useGetEventSessionRegistrationIntent = (
  eventId: string = "",
  sessionId: string = "",
  addressId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionRegistrationIntent>
  >(
    EVENT_SESSION_REGISTRATION_INTENT_QUERY_KEY(eventId, sessionId, addressId),
    (params) =>
      GetEventSessionRegistrationIntent({
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
