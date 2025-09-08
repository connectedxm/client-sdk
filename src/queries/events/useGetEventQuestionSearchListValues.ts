import type { SearchListValue } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_QUESTION_SEARCH_LIST_QUERY_KEY } from "./useGetEventQuestionSearchList";

export const EVENT_QUESTION_SEARCH_LIST_VALUES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTION_SEARCH_LIST_QUERY_KEY(eventId, questionId), "VALUES"];

export interface GetEventQuestionSearchListValuesProps
  extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
  top?: boolean;
}

export const GetEventQuestionSearchListValues = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  top,
  clientApiParams,
}: GetEventQuestionSearchListValuesProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/questions/${questionId}/searchlist/values`,
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

export const useGetEventQuestionSearchListValues = (
  eventId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > & { top?: boolean } = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionSearchListValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionSearchListValues>>
  >(
    EVENT_QUESTION_SEARCH_LIST_VALUES_QUERY_KEY(eventId, questionId),
    (queryParams: InfiniteQueryParams) =>
      GetEventQuestionSearchListValues({
        eventId,
        questionId,
        ...params,
        ...queryParams,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!questionId && (options?.enabled ?? true),
    }
  );
};
