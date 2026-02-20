import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { QueryKey } from "@tanstack/react-query";
import { EVENT_SESSIONS_QUERY_KEY } from "./useGetEventSessions";

export const EVENT_SESSION_PASS_INTENT_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  passId: string,
  addressId?: string
): QueryKey => {
  const key = [
    ...EVENT_SESSIONS_QUERY_KEY(eventId),
    sessionId,
    "PASSES",
    passId,
    "INTENT",
  ];
  if (addressId) {
    key.push(addressId);
  }
  return key;
};

export interface GetEventSessionPassIntentProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
  addressId: string;
}

export const GetEventSessionPassIntent = async ({
  eventId,
  sessionId,
  passId,
  addressId,
  clientApiParams,
}: GetEventSessionPassIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}/intent`,
    {
      params: {
        addressId,
      },
    }
  );
  return data;
};

export const useGetEventSessionPassIntent = (
  eventId: string = "",
  sessionId: string = "",
  passId: string = "",
  addressId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionPassIntent>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionPassIntent>>(
    EVENT_SESSION_PASS_INTENT_QUERY_KEY(eventId, sessionId, passId, addressId),
    (params) =>
      GetEventSessionPassIntent({
        eventId,
        sessionId,
        passId,
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
        !!passId &&
        !!addressId &&
        (options?.enabled ?? true),
    }
  );
};
