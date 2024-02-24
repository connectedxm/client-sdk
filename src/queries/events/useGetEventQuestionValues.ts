import type { RegistrationQuestionSearchValue } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_QUESTION_VALUES_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUERY_KEY(eventId), "QUESTIONS", questionId, "VALUES"];

export interface GetEventQuestionSearchValuesProps extends InfiniteQueryParams {
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
  clientApiParams,
}: GetEventQuestionSearchValuesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionSearchValue[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
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

export const useGetEventQuestionSearchValues = (
  eventId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventQuestionSearchValues>>
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
