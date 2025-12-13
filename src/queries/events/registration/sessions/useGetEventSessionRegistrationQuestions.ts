import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_SESSION_REGISTRATION_QUERY_KEY } from "./useGetEventSessionRegistration";

export const EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string
): QueryKey => [
  ...EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
  "QUESTIONS",
];

export const SET_EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRegistrationQuestions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventSessionRegistrationQuestionsProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionRegistrationQuestions = async ({
  eventId,
  sessionId,
  clientApiParams,
}: GetEventSessionRegistrationQuestionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/sessions/${sessionId}/registration/questions`,
    {}
  );

  return data;
};

export const useGetEventSessionRegistrationQuestions = (
  eventId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionRegistrationQuestions>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionRegistrationQuestions>
  >(
    EVENT_SESSION_REGISTRATION_QUESTIONS_QUERY_KEY(eventId, sessionId),
    (params: SingleQueryParams) =>
      GetEventSessionRegistrationQuestions({
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
