import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY } from "../../useGetEventAttendee";

export const EVENT_ATTENDEE_PASS_SESSIONS_INTENT_QUERY_KEY = (
  eventId: string,
  passId: string,
  addressId: string,
  sessionIds: string[]
): QueryKey => {
  const key = [
    ...EVENT_ATTENDEE_QUERY_KEY(eventId),
    passId,
    "SESSIONS_INTENT",
  ];

  if (sessionIds) {
    key.push(...sessionIds);
  }

  key.push(addressId);

  return key;
};

export interface GetEventAttendeePassSessionsIntentProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
  sessionIds: string[];
  addressId: string;
}

export const GetEventAttendeePassSessionsIntent = async ({
  eventId,
  passId,
  sessionIds,
  addressId,
  clientApiParams,
}: GetEventAttendeePassSessionsIntentProps): Promise<
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

export const useGetEventAttendeePassSessionsIntent = (
  eventId: string = "",
  passId: string = "",
  addressId: string = "",
  sessionIds: string[],
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassSessionsIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassSessionsIntent>
  >(
    EVENT_ATTENDEE_PASS_SESSIONS_INTENT_QUERY_KEY(
      eventId,
      passId,
      addressId,
      sessionIds
    ),
    (params: SingleQueryParams) =>
      GetEventAttendeePassSessionsIntent({
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
