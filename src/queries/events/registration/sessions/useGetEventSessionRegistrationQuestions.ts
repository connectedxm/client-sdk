import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY } from "./useGetSelfEventSessionRegistration";

export const SELF_EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string
): QueryKey => [
  ...SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
  "QUESTIONS",
];

export const SET_SELF_EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventSessionRegistrationQuestions>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventSessionRegistrationQuestionsProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetSelfEventSessionRegistrationQuestions = async ({
  eventId,
  sessionId,
  clientApiParams,
}: GetSelfEventSessionRegistrationQuestionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/sessions/${sessionId}/registration/questions`,
    {}
  );

  return data;
};

export const useGetSelfEventSessionRegistrationQuestions = (
  eventId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventSessionRegistrationQuestions>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventSessionRegistrationQuestions>
  >(
    SELF_EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_KEY(eventId, sessionId),
    (params: SingleQueryParams) =>
      GetSelfEventSessionRegistrationQuestions({
        eventId,
        sessionId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!sessionId &&
        (options?.enabled ?? true),
    }
  );
};
