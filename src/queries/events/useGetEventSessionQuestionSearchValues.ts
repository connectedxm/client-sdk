import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import {
  ConnectedXMResponse,
  EventSessionQuestionSearchValue,
} from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";

export const EVENT_SESSION_QUESTION_VALUES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [
  ...EVENT_SESSION_QUERY_KEY(eventId, sessionId),
  "QUESTIONS",
  questionId,
  "VALUES",
];

export interface GetEventSessionQuestionSearchValuesProps
  extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

export const GetEventSessionQuestionSearchValues = async ({
  eventId,
  sessionId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventSessionQuestionSearchValuesProps): Promise<
  ConnectedXMResponse<EventSessionQuestionSearchValue[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/values`,
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

export const useGetEventSessionQuestionSearchValues = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionQuestionSearchValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionQuestionSearchValues>>
  >(
    EVENT_SESSION_QUESTION_VALUES_QUERY_KEY(eventId, sessionId, questionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionQuestionSearchValues({
        eventId,
        sessionId,
        questionId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && (options?.enabled ?? true),
    }
  );
};
