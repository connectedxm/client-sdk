import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "../useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_SESSION_PASSES_INTENT_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  addressId: string,
  accessIds: string[]
) => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  sessionId,
  addressId,
  "SESSION_PASSES_INTENT",
  ...accessIds,
];

export type AccessesInput = {
  passId: string;
}[];

export interface GetSelfEventAttendeeAccessesIntentProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  addressId: string;
  accesses: AccessesInput;
}

export const GetSelfEventAttendeeAccessesIntent = async ({
  eventId,
  sessionId,
  addressId,
  accesses,
  clientApiParams,
}: GetSelfEventAttendeeAccessesIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<PaymentIntent>>(
    `/self/events/${eventId}/attendee/sessions/${sessionId}/intent`,
    {
      addressId,
      accesses,
    }
  );

  return data;
};

export const useGetSelfEventAttendeeAccessesIntent = (
  eventId: string,
  sessionId: string,
  addressId: string,
  accesses: AccessesInput,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeeAccessesIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeeAccessesIntent>
  >(
    SELF_EVENT_ATTENDEE_SESSION_PASSES_INTENT_QUERY_KEY(
      eventId,
      sessionId,
      addressId,
      accesses.map(({ passId }) => passId)
    ),
    (params) =>
      GetSelfEventAttendeeAccessesIntent({
        eventId,
        sessionId,
        addressId,
        accesses,
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
        !!accesses &&
        (options?.enabled ?? true),
    }
  );
};
