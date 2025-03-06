import type { SurveyQuestionSearchValue } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SURVEY_QUERY_KEY } from "./useGetSurvey";

export const SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => [...SURVEY_QUERY_KEY(surveyId), "QUESTIONS", questionId, "VALUES"];

export interface GetSurveyQuestionSearchValuesProps
  extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
}

export const GetSurveyQuestionSearchValues = async ({
  surveyId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSurveyQuestionSearchValuesProps): Promise<
  ConnectedXMResponse<SurveyQuestionSearchValue[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/surveys/${surveyId}/questions/${questionId}/values`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetSurveyQuestionSearchValues = (
  surveyId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionSearchValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionSearchValues>>
  >(
    SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY(surveyId, questionId),
    (params: InfiniteQueryParams) =>
      GetSurveyQuestionSearchValues({
        surveyId,
        questionId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && !!questionId && (options?.enabled ?? true),
    }
  );
};
