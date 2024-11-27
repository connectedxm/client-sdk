import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "../useGetSelfEventRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_REGISTRATION_SESSION_PASSES_INTENT_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  sessionId: string,
  sessionPassIds: string[]
) => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  registrationId,
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

export interface GetSelfEventRegistrationSessionPassesIntentProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  sessionId: string;
  sessionPasses: SessionPassesInput;
}

export const GetSelfEventRegistrationSessionPassesIntent = async ({
  eventId,
  registrationId,
  sessionId,
  sessionPasses,
  clientApiParams,
}: GetSelfEventRegistrationSessionPassesIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<PaymentIntent>>(
    `/self/events/${eventId}/registration/${registrationId}/sessions/${sessionId}/intent`,
    sessionPasses
  );
  return data;
};

export const useGetSelfEventRegistrationSessionPassesIntent = (
  eventId: string,
  registrationId: string,
  sessionId: string,
  sessionPasses: SessionPassesInput,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationSessionPassesIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationSessionPassesIntent>
  >(
    SELF_EVENT_REGISTRATION_SESSION_PASSES_INTENT_QUERY_KEY(
      eventId,
      registrationId,
      sessionId,
      sessionPasses.map(({ passId }) => passId)
    ),
    (params) =>
      GetSelfEventRegistrationSessionPassesIntent({
        eventId,
        registrationId,
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
        !!registrationId &&
        !!sessionId &&
        !!sessionPasses &&
        (options?.enabled ?? true),
    }
  );
};
