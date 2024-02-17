import type { Faq } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUESTION_QUERY_KEY } from "./useGetEventFAQSectionQuestion";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "./useGetEventFAQSection";
import { ConnectedXMResponse } from "@interfaces";

export const EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
): QueryKey => [
  ...EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
  "FAQ_SECTION_QUESTIONS",
];

export const SET_EVENT_FAQ_SECTION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFaqs>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventFaqsProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventFaqs = async ({
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetEventFaqsProps): Promise<ConnectedXMResponse<Faq[]>> => {
  const { data } = await clientApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (faqId) =>
        EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(eventId, sectionId, faqId),
      locale
    );
  }

  return data;
};

export const useGetEventFaqs = (
  eventId: string,
  sectionId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEventFaqs>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventFaqs>>>(
    EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventFaqs({ eventId, sectionId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options.enabled ?? true),
    }
  );
};
