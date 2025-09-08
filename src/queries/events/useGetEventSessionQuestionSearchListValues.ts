import type { SearchListValue } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SESSION_QUESTION_SEARCH_LIST_QUERY_KEY } from "./useGetEventSessionQuestionSearchList";

export const EVENT_SESSION_QUESTION_SEARCH_LIST_VALUES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [
  ...EVENT_SESSION_QUESTION_SEARCH_LIST_QUERY_KEY(
    eventId,
    sessionId,
    questionId
  ),
  "VALUES",
];

export interface GetEventSessionQuestionSearchListValuesProps
  extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  top?: boolean;
}

export const GetEventSessionQuestionSearchListValues = async ({
  eventId,
  sessionId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  top,
  clientApiParams,
}: GetEventSessionQuestionSearchListValuesProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/searchlist/values`,
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

export const useGetEventSessionQuestionSearchListValues = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > & { top?: boolean } = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionSearchListValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionSearchListValues>>
  >(
    EVENT_SESSION_QUESTION_SEARCH_LIST_VALUES_QUERY_KEY(
      eventId,
      sessionId,
      questionId
    ),
    (queryParams: InfiniteQueryParams) =>
      GetEventSessionQuestionSearchListValues({
        eventId,
        sessionId,
        questionId,
        ...params,
        ...queryParams,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && (options?.enabled ?? true),
    }
  );
};
