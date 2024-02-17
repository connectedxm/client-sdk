import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Faq } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY } from "./useGetEventFAQSectionQuestions";
import { ConnectedXMResponse } from "@interfaces";

export const EVENT_FAQ_SECTION_QUESTION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  questionId: string
): QueryKey => [
  ...EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
  questionId,
];

export const SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFAQSectionQuestion>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventFAQSectionQuestionProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

export const GetEventFAQSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  clientApi,
}: GetEventFAQSectionQuestionProps): Promise<ConnectedXMResponse<Faq>> => {
  const { data } = await clientApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}`
  );
  return data;
};

export const useGetEventFAQSectionQuestion = (
  eventId: string,
  sectionId: string,
  questionId: string,

  options: SingleQueryOptions<
    ReturnType<typeof GetEventFAQSectionQuestion>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFAQSectionQuestion>>(
    EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(eventId, sectionId, questionId),
    (params) =>
      GetEventFAQSectionQuestion({ eventId, sectionId, questionId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!sectionId && !!questionId && (options?.enabled ?? true),
    }
  );
};
