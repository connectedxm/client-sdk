import type { RegistrationQuestionSearchValue } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ConnectedXMResponse } from "@interfaces";

export const EVENT_QUESTION_VALUES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUERY_KEY(eventId), "QUESTIONS", questionId, "VALUES"];

interface GetEventQuestionSearchValuesProps extends InfiniteQueryParams {
  eventId: string;
  questionId: string;
}

export const GetEventQuestionSearchValues = async ({
  eventId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApi,
}: GetEventQuestionSearchValuesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionSearchValue[]>
> => {
  const { data } = await clientApi.get(
    `/events/${eventId}/questions/${questionId}/values`,
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

const useGetEventQuestionSearchValues = (
  eventId: string,
  questionId: string,
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    ReturnType<typeof GetEventQuestionSearchValues>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    ReturnType<typeof GetEventQuestionSearchValues>
  >(
    EVENT_QUESTION_VALUES_QUERY_KEY(eventId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventQuestionSearchValues({
        eventId,
        questionId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!questionId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventQuestionSearchValues;
