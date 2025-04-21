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

export interface GetSelfEventSessionRegistrationIntentProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  addressId: string;
  accesses: AccessesInput;
}

export const GetSelfEventSessionRegistrationIntent = async ({
  eventId,
  sessionId,
  addressId,
  accesses,
  clientApiParams,
}: GetSelfEventSessionRegistrationIntentProps): Promise<
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

export const useGetSelfEventSessionRegistrationIntent = (
  eventId: string,
  sessionId: string,
  addressId: string,
  accesses: AccessesInput,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventSessionRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventSessionRegistrationIntent>
  >(
    SELF_EVENT_ATTENDEE_SESSION_PASSES_INTENT_QUERY_KEY(
      eventId,
      sessionId,
      addressId,
      accesses.map(({ passId }) => passId)
    ),
    (params) =>
      GetSelfEventSessionRegistrationIntent({
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
