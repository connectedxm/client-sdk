import type { SearchList } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

export const EVENT_SESSION_QUESTION_SEARCH_LIST_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [
  ...EVENT_SESSION_QUERY_KEY(eventId, sessionId),
  "QUESTIONS",
  questionId,
  "SEARCHLIST",
];

export interface GetEventSessionQuestionSearchListProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

export const GetEventSessionQuestionSearchList = async ({
  eventId,
  sessionId,
  questionId,
  clientApiParams,
}: GetEventSessionQuestionSearchListProps): Promise<
  ConnectedXMResponse<SearchList>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/searchlist`
  );
  return data;
};

export const useGetEventSessionQuestionSearchList = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionQuestionSearchList>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionQuestionSearchList>
  >(
    EVENT_SESSION_QUESTION_SEARCH_LIST_QUERY_KEY(
      eventId,
      sessionId,
      questionId
    ),
    (params: SingleQueryParams) =>
      GetEventSessionQuestionSearchList({
        eventId,
        sessionId,
        questionId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && (options?.enabled ?? true),
    }
  );
};
