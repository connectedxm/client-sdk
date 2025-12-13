import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_PASS_ACCESS_QUERY_KEY } from "./useGetEventPassAccess";

export const EVENT_PASS_ACCESS_QUESTIONS_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionId: string
): QueryKey => [
  ...EVENT_PASS_ACCESS_QUERY_KEY(eventId, passId, sessionId),
  "QUESTIONS",
];

export const SET_EVENT_PASS_ACCESS_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_PASS_ACCESS_QUESTIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetEventPassAccessQuestions>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_ACCESS_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassAccessQuestionsProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

export const GetEventPassAccessQuestions = async ({
  eventId,
  sessionId,
  passId,
  clientApiParams,
}: GetEventPassAccessQuestionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/questions`
  );

  return data;
};

export const useGetEventPassAccessQuestions = (
  eventId: string,
  passId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassAccessQuestions>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventPassAccessQuestions>
  >(
    EVENT_PASS_ACCESS_QUESTIONS_QUERY_KEY(
      eventId,
      passId,
      sessionId
    ),
    (params: SingleQueryParams) =>
      GetEventPassAccessQuestions({
        eventId,
        passId,
        sessionId,
        ...params,
      }),
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!passId &&
        !!sessionId &&
        (options?.enabled ?? true),
    }
  );
};
