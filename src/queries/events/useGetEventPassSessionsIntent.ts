import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "../self/attendee/useGetSelfEventAttendee";

export const EVENT_PASS_SESSIONS_INTENT_QUERY_KEY = (
  eventId: string,
  passId: string,
  addressId: string,
  sessionIds: string[]
): QueryKey => {
  const key = [
    ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    passId,
    "SESSIONS_INTENT",
  ];

  if (sessionIds) {
    key.push(...sessionIds);
  }

  key.push(addressId);

  return key;
};

export interface GetEventPassSessionsIntentProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  sessionIds: string[];
  addressId: string;
}

export const GetEventPassSessionsIntent = async ({
  eventId,
  passId,
  sessionIds,
  addressId,
  clientApiParams,
}: GetEventPassSessionsIntentProps): Promise<
  ConnectedXMResponse<PaymentIntent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/intent`,
    {
      sessionIds,
      addressId,
    }
  );

  return data;
};

export const useGetEventPassSessionsIntent = (
  eventId: string = "",
  passId: string = "",
  addressId: string = "",
  sessionIds: string[],
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassSessionsIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventPassSessionsIntent>>(
    EVENT_PASS_SESSIONS_INTENT_QUERY_KEY(
      eventId,
      passId,
      addressId,
      sessionIds
    ),
    (params: SingleQueryParams) =>
      GetEventPassSessionsIntent({
        eventId,
        passId,
        addressId,
        sessionIds,
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
        !!passId &&
        sessionIds.length > 0 &&
        (options?.enabled ?? true),
    }
  );
};
