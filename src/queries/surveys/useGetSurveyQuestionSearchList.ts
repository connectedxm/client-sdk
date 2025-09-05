import type { SearchList } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SURVEY_QUERY_KEY } from "./useGetSurvey";

export const SURVEY_QUESTION_SEARCH_LIST_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => [...SURVEY_QUERY_KEY(surveyId), "QUESTIONS", questionId, "SEARCHLIST"];

export interface GetSurveyQuestionSearchListProps extends SingleQueryParams {
  surveyId: string;
  questionId: string;
}

export const GetSurveyQuestionSearchList = async ({
  surveyId,
  questionId,
  clientApiParams,
}: GetSurveyQuestionSearchListProps): Promise<
  ConnectedXMResponse<SearchList>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/surveys/${surveyId}/questions/${questionId}/searchlist`
  );
  return data;
};

export const useGetSurveyQuestionSearchList = (
  surveyId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSurveyQuestionSearchList>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSurveyQuestionSearchList>
  >(
    SURVEY_QUESTION_SEARCH_LIST_QUERY_KEY(surveyId, questionId),
    (params: SingleQueryParams) =>
      GetSurveyQuestionSearchList({
        surveyId,
        questionId,
        ...params,
      }),
    {
      ...options,
      enabled: !!surveyId && !!questionId && (options?.enabled ?? true),
    }
  );
};
