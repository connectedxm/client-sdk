import type { SearchList } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_QUERY_KEY } from "./useGetEvent";

export const EVENT_QUESTION_SEARCH_LIST_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUERY_KEY(eventId), "QUESTIONS", questionId, "SEARCHLIST"];

export interface GetEventQuestionSearchListProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
}

export const GetEventQuestionSearchList = async ({
  eventId,
  questionId,
  clientApiParams,
}: GetEventQuestionSearchListProps): Promise<
  ConnectedXMResponse<SearchList>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/questions/${questionId}/searchlist`
  );
  return data;
};

export const useGetEventQuestionSearchList = (
  eventId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventQuestionSearchList>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventQuestionSearchList>>(
    EVENT_QUESTION_SEARCH_LIST_QUERY_KEY(eventId, questionId),
    (params: SingleQueryParams) =>
      GetEventQuestionSearchList({
        eventId,
        questionId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!questionId && (options?.enabled ?? true),
    }
  );
};
