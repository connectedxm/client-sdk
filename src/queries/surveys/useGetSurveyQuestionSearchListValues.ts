import type { SearchListValue } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SURVEY_QUESTION_SEARCH_LIST_QUERY_KEY } from "./useGetSurveyQuestionSearchList";

export const SURVEY_QUESTION_SEARCH_LIST_VALUES_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => [...SURVEY_QUESTION_SEARCH_LIST_QUERY_KEY(surveyId, questionId), "VALUES"];

export interface GetSurveyQuestionSearchListValuesProps
  extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
  top?: boolean;
}

export const GetSurveyQuestionSearchListValues = async ({
  surveyId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  top,
  clientApiParams,
}: GetSurveyQuestionSearchListValuesProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/surveys/${surveyId}/questions/${questionId}/searchlist/values`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        top: top || undefined,
      },
    }
  );
  return data;
};

export const useGetSurveyQuestionSearchListValues = (
  surveyId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > & { top?: boolean } = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionSearchListValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionSearchListValues>>
  >(
    SURVEY_QUESTION_SEARCH_LIST_VALUES_QUERY_KEY(surveyId, questionId),
    (queryParams: InfiniteQueryParams) =>
      GetSurveyQuestionSearchListValues({
        surveyId,
        questionId,
        ...params,
        ...queryParams,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && !!questionId && (options?.enabled ?? true),
    }
  );
};
