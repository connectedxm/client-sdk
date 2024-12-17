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
  sessionPassIds: string[]
) => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  sessionId,
  ...sessionPassIds,
  "SESSION_PASSES_INTENT",
];

export type SessionPassesInput = {
  passId: string;
  responses: {
    questionId: string;
    value: string;
  }[];
}[];

export interface GetSelfEventAttendeeSessionPassesIntentProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  sessionPasses: SessionPassesInput;
}

export const GetSelfEventAttendeeSessionPassesIntent = async ({
  eventId,
  sessionId,
  sessionPasses,
  clientApiParams,
}: GetSelfEventAttendeeSessionPassesIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<PaymentIntent>>(
    `/self/events/${eventId}/attendee/sessions/${sessionId}/intent`,
    sessionPasses
  );

  return data;
};

export const useGetSelfEventAttendeeSessionPassesIntent = (
  eventId: string,
  sessionId: string,
  sessionPasses: SessionPassesInput,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeeSessionPassesIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeeSessionPassesIntent>
  >(
    SELF_EVENT_ATTENDEE_SESSION_PASSES_INTENT_QUERY_KEY(
      eventId,
      sessionId,
      sessionPasses.map(({ passId }) => passId)
    ),
    (params) =>
      GetSelfEventAttendeeSessionPassesIntent({
        eventId,
        sessionId,
        sessionPasses,
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
        !!sessionPasses &&
        (options?.enabled ?? true),
    }
  );
};
